import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  Dropdown,
  DropdownRef,
  Grid,
  InfiniteScroll,
  Input,
  List,
  Selector,
} from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { withDefault, StringParam, useQueryParam } from 'use-query-params';
import {
  getOtcFindAdListQueryKey,
  otcFindAdList,
  useIdentityGet,
  useOtcCreateOrder,
} from '../../api/endpoints/transformer';
import { OtcFindAdListItem } from '../../api/model';

import LegalMoneyHeader from './LegalMoneyHeader';
import OptionalBuySellDialog from './OptionalBuySellDialog';
import OptionalCurrencies from './OptionalCurrencies';
import OptionalListItem from './OptionalListItem';

const filterPayWays = [
  {
    label: '全部',
    value: '0',
  },
  {
    label: '支付寶',
    value: '1',
  },
  {
    label: '微信',
    value: '2',
  },
  {
    label: '銀行卡',
    value: '3',
  },
];

const TypeParam = withDefault(StringParam, 'buy');

const LegalMoneyOptional = () => {
  const [type, setType] = useQueryParam('type', TypeParam);
  const [action, setAction] = useState<string>('');

  const [filterCny, setFilterCny] = useState<string>('');

  const [symbol, setSymbol] = useState<string>('CNY');
  const [filterPayWay, setFilterPayWay] = useState<string>('');

  const dropdownRef = useRef<DropdownRef>(null);

  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getOtcFindAdListQueryKey({ buySell: type }),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await otcFindAdList({
        pageNo: pageParam,
        buySell: type,
        currencyType: symbol,
        filterCny: filterCny,
        filterPayWay: filterPayWay,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (Number(lastPage?.pageSize) === lastPage?.data?.length ?? 0) {
        return Number(lastPage?.pageNo) + 1;
      }
    },
  });

  const dataSource = useMemo(
    () => data?.pages.map((v) => v?.data ?? []).flat() ?? [],
    [data?.pages],
  );

  const { data: identityGet } = useIdentityGet();

  const identityAuth = useMemo(
    () => identityGet?.data?.identityAuth,
    [identityGet?.data?.identityAuth],
  );

  const history = useHistory();
  const [optionalOrder, setOptionalOrder] = useState<OtcFindAdListItem>();
  const handleItemClick = useCallback(
    (item: OtcFindAdListItem) => {
      if (identityAuth?.state === '1') {
        setOptionalOrder(item);
        setAction('buy');
      } else {
        Dialog.alert({
          title: '提示',
          content: '賬戶未實名',
          confirmText: '去認證',
          closeOnMaskClick: true,
          onConfirm() {
            history.push('/verified');
          },
        });
      }
    },
    [history, identityAuth?.state, setAction],
  );

  const otcCreateOrder = useOtcCreateOrder({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          history.push({
            pathname: '/legal-order-info',
            search: stringify({
              orderId: data.data?.orderId,
            }),
          });
        }
      },
    },
  });

  return (
    <Container className="flex-1 flex flex-col min-h-0">
      <LegalMoneyHeader value={type} onChange={(value) => setType(value, 'replaceIn')} />
      <div className="border-b">
        <Dropdown ref={dropdownRef}>
          <Dropdown.Item key="sorter" title="支付方式">
            <div className="p-4">
              <Selector
                defaultValue={['0']}
                columns={3}
                onChange={(value) => {
                  setFilterPayWay(value?.[0] ?? '');
                  dropdownRef.current?.close();
                  refetch();
                }}
                options={filterPayWays}
                showCheckMark={false}
              />
            </div>
          </Dropdown.Item>
          <Dropdown.Item key="bizop" title="交易金額">
            <div className="p-4">
              <div className="relative flex items-center">
                <Input
                  type="number"
                  value={filterCny}
                  onChange={setFilterCny}
                  placeholder="系統會為您篩選包含目標金額的商品"
                  className="border border-[#465B98] h-10 px-4"
                />
                <span className="absolute right-0">
                  <OptionalCurrencies value={symbol} onChange={(value) => setSymbol(value)} />
                </span>
              </div>

              <Selector
                className="mt-4"
                columns={3}
                onChange={(value) => {
                  if (value[0]) {
                    setFilterCny(value[0]);
                  }
                }}
                options={[
                  { label: '100', value: '100' },
                  { label: '1000', value: '1000' },
                  { label: '10000', value: '10000' },
                  { label: '50000', value: '50000' },
                  { label: '200000', value: '200000' },
                  { label: '500000', value: '500000' },
                ]}
                showCheckMark={false}
              />
            </div>

            <Grid columns={2} gap={8} className="mb-4 px-4">
              <Grid.Item>
                <Button
                  block
                  onClick={() => {
                    setFilterPayWay('');
                    dropdownRef.current?.close();
                    refetch();
                  }}
                >
                  重置
                </Button>
              </Grid.Item>
              <Grid.Item>
                <Button
                  block
                  color="primary"
                  onClick={() => {
                    dropdownRef.current?.close();
                    refetch();
                  }}
                >
                  确定
                </Button>
              </Grid.Item>
            </Grid>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="flex-1 overflow-y-auto">
        <List>
          {dataSource.map((v, i) => (
            <List.Item key={(v.adId ?? '') + i}>
              <OptionalListItem data={v} buySell={type} onClick={handleItemClick} />
            </List.Item>
          ))}
        </List>
        <InfiniteScroll
          loadMore={async () => {
            await fetchNextPage();
          }}
          hasMore={hasNextPage}
        />
      </div>

      <OptionalBuySellDialog
        optionalOrder={optionalOrder}
        open={action === 'buy'}
        onClose={() => {
          setAction('');
          setOptionalOrder(undefined);
        }}
        onSubmit={(data) => {
          otcCreateOrder.mutate({
            data,
          });
        }}
      />
    </Container>
  );
};

const Container = styled.div``;

export default LegalMoneyOptional;
