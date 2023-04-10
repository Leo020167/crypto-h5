import { useInfiniteQuery } from '@tanstack/react-query';
import { Badge, Button, Dropdown, DropdownRef, Grid, List, Selector } from 'antd-mobile';
import { keyBy } from 'lodash-es';
import { stringify } from 'query-string';
import { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  getOtcFindOrderListQueryKey,
  otcFindOrderList,
  useGetUnreadCount,
} from '../../api/endpoints/transformer';
import { OtcOrderListItem } from '../../api/model/otcOrderListItem';
import ScreenWithInfiniteScroll from '../../components/ScreenWithInfiniteScroll';
import { stringDateFormat } from '../../utils/date';
import { ReactComponent as Arrow } from './../../assets/ic_svg_arrow_2.svg';

const getStateColor = (value?: string) => {
  if (value === '0' || value === '1' || value === '2') {
    return '#6175AE';
  }
  return '#9A9A9A';
};

const OtcOrderHistory = () => {
  const ref = useRef<DropdownRef>(null);

  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getOtcFindOrderListQueryKey({}),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await otcFindOrderList({ pageNo: pageParam, buySell: buySell?.[0] ?? '' });
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

  const [buySell, setBuySell] = useState<string[]>([]);

  const history = useHistory();

  const { data: getUnreadCount } = useGetUnreadCount();

  const otcListHash = useMemo(() => {
    if (getUnreadCount?.data?.otcList?.length) {
      return keyBy(getUnreadCount?.data?.otcList, (v) => v.orderId ?? '');
    }
    return {};
  }, [getUnreadCount?.data?.otcList]);

  const intl = useIntl();

  return (
    <ScreenWithInfiniteScroll
      headerTitle={intl.formatMessage({ defaultMessage: '订单记录', id: 'VvurtK' })}
      navBarProps={{
        right: (
          <Dropdown ref={ref}>
            <Dropdown.Item key="sorter" title="筛选">
              <div className="p-4">
                <div className="flex flex-1 flex-col">
                  <div className="text-base text-[#1D3155]">
                    {intl.formatMessage({ defaultMessage: '类型选择', id: 'B6j8h5' })}
                  </div>
                  <Selector
                    className="mb-8 mt-1.5"
                    columns={4}
                    options={[
                      {
                        label: intl.formatMessage({ defaultMessage: '購買', id: 'eXPzpx' }),
                        value: 'buy',
                      },
                      {
                        label: intl.formatMessage({ defaultMessage: '出售', id: '5zfR27' }),
                        value: 'sell',
                      },
                    ]}
                    showCheckMark={false}
                    value={buySell}
                    onChange={setBuySell}
                  />
                </div>

                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <Button
                      block
                      onClick={() => {
                        setBuySell([]);
                        ref.current?.close();
                        refetch();
                      }}
                    >
                      {intl.formatMessage({ defaultMessage: '重置', id: 'r2dEd/' })}
                    </Button>
                  </Grid.Item>
                  <Grid.Item>
                    <Button
                      block
                      color="primary"
                      onClick={() => {
                        ref.current?.close();
                        refetch();
                      }}
                    >
                      {intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' })}
                    </Button>
                  </Grid.Item>
                </Grid>
              </div>
            </Dropdown.Item>
          </Dropdown>
        ),
      }}
      dataSource={dataSource}
      renderItem={(item: OtcOrderListItem) => {
        return (
          <List.Item
            key={item.orderId}
            arrow={null}
            onClick={() => {
              history.push({
                pathname: '/legal-order-info',
                search: stringify({ orderId: item.orderId }),
              });
            }}
          >
            <div className="flex flex-col">
              <div className="flex h-10 items-center justify-between">
                <span className="font-bold text-[#3D3A50]">{item.buySellValue}</span>
                <div className="flex items-center" style={{ color: getStateColor(item.state) }}>
                  <Badge content={otcListHash[item.orderId ?? '']?.count || null}>
                    <span>{item.stateValue}</span>
                  </Badge>

                  <Arrow className="ml-4" />
                </div>
              </div>

              <div className="flex flex-1 justify-between">
                <div className="flex w-1/3 flex-col text-xs">
                  <div className="text-[#BEBEBE]">
                    {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
                  </div>
                  <div className="mt-1 text-[#3D3A50]">{stringDateFormat(item.createTime)}</div>
                </div>

                <div className="flex w-1/3 flex-col items-center text-xs">
                  <div className="text-[#BEBEBE]">
                    {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
                  </div>
                  <div className="mt-1 text-[#3D3A50]">{item.amount ?? '--'}</div>
                </div>

                <div className="flex w-1/3 flex-col items-end text-xs">
                  <div className="text-[#BEBEBE]">
                    {intl.formatMessage(
                      { defaultMessage: '交易金額({currencySign})', id: '5UBWei' },
                      {
                        currencySign: item.currencySign,
                      },
                    )}
                  </div>
                  <div className="mt-1 text-[#3D3A50]">{item.tolPrice ?? '--'}</div>
                </div>
              </div>
            </div>
          </List.Item>
        );
      }}
      loadMore={async () => {
        await fetchNextPage();
      }}
      hasMore={hasNextPage}
      onRefresh={refetch}
    />
  );
};

export default OtcOrderHistory;
