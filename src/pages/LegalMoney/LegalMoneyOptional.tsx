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
import { useIntl } from 'react-intl';
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
import OptionalListItem from '../../components/OptionalListItem';
import LegalMoneyHeader from './LegalMoneyHeader';
import OptionalBuySellDialog from './OptionalBuySellDialog';
import OptionalCurrencies from './OptionalCurrencies';

const TypeParam = withDefault(StringParam, 'buy');

const LegalMoneyOptional = () => {
  const [type, setType] = useQueryParam('type', TypeParam);
  const [action, setAction] = useState<string>('');

  const [filterCny, setFilterCny] = useState<string>('');

  const [symbol, setSymbol] = useState<string>('CNY');
  const [filterPayWay, setFilterPayWay] = useState<string>('');

  const dropdownRef = useRef<DropdownRef>(null);

  const intl = useIntl();

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
          title: intl.formatMessage({ defaultMessage: '提示', id: 'kCh5Jz' }),
          content: intl.formatMessage({ defaultMessage: '賬戶未實名', id: '98NP8A' }),
          confirmText: intl.formatMessage({ defaultMessage: '去認證', id: 'jefLBO' }),
          closeOnMaskClick: true,
          onConfirm() {
            history.push('/verified');
          },
        });
      }
    },
    [history, identityAuth?.state, intl],
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

  const filterPayWays = useMemo(
    () => [
      {
        label: intl.formatMessage({ defaultMessage: '全部', id: 'dGBGbt' }),
        value: '0',
      },
      {
        label: intl.formatMessage({ defaultMessage: '支付寶', id: '2FTlRq' }),
        value: '1',
      },
      {
        label: intl.formatMessage({ defaultMessage: '微信', id: 'g6V3he' }),
        value: '2',
      },
      {
        label: intl.formatMessage({ defaultMessage: '銀行卡', id: '1sn0tp' }),
        value: '3',
      },
    ],
    [intl],
  );

  return (
    <Container className="flex-1 flex flex-col min-h-0">
      <LegalMoneyHeader value={type} onChange={(value) => setType(value, 'replaceIn')} />
      <div className="border-b">
        <Dropdown ref={dropdownRef}>
          <Dropdown.Item
            key="sorter"
            title={intl.formatMessage({ defaultMessage: '支付方式', id: 'TZUB/k' })}
          >
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
          <Dropdown.Item
            key="bizop"
            title={intl.formatMessage({ defaultMessage: '交易金額', id: 'A7hKV4' })}
          >
            <div className="p-4">
              <div className="relative flex items-center">
                <Input
                  type="number"
                  value={filterCny}
                  onChange={setFilterCny}
                  placeholder={intl.formatMessage({
                    defaultMessage: '系統會為您篩選包含目標金額的商品',
                    id: '8TceES',
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: '重置',
                    id: 'r2dEd/',
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: '确定',
                    id: 'r0/TUu',
                  })}
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
