import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Dropdown, DropdownRef, Grid, List, Selector } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOtcFindOrderListQueryKey, otcFindOrderList } from '../../api/endpoints/transformer';
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

  const navigate = useNavigate();

  return (
    <ScreenWithInfiniteScroll
      headerTitle="订单记录"
      navBarProps={{
        right: (
          <Dropdown ref={ref}>
            <Dropdown.Item key="sorter" title="筛选">
              <div className="p-4">
                <div className="flex-1 flex flex-col">
                  <div className="text-[#1D3155] text-base">类型选择</div>
                  <Selector
                    className="mt-1.5 mb-8"
                    columns={4}
                    options={[
                      {
                        label: '購買',
                        value: 'buy',
                      },
                      {
                        label: '出售',
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
                      重置
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
                      确定
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
              navigate({
                pathname: '/legal-order-info',
                search: stringify({ orderId: item.orderId }),
              });
            }}
          >
            <div className="flex flex-col">
              <div className="h-10 flex items-center justify-between">
                <span className="text-[#3D3A50] font-bold">{item.buySellValue}</span>
                <div className="flex items-center" style={{ color: getStateColor(item.state) }}>
                  <span className="mr-4">{item.stateValue}</span>
                  <Arrow />
                </div>
              </div>

              <div className="flex-1 flex justify-between">
                <div className="flex flex-col text-xs w-1/3">
                  <div className="text-[#BEBEBE]">時間</div>
                  <div className="text-[#3D3A50] mt-1">{stringDateFormat(item.createTime)}</div>
                </div>

                <div className="flex flex-col text-xs w-1/3 items-center">
                  <div className="text-[#BEBEBE]">數量</div>
                  <div className="text-[#3D3A50] mt-1">{item.amount ?? '--'}</div>
                </div>

                <div className="flex flex-col text-xs w-1/3 items-end">
                  <div className="text-[#BEBEBE]">{`交易金額(${item.currencySign})`}</div>
                  <div className="text-[#3D3A50] mt-1">{item.tolPrice ?? '--'}</div>
                </div>
              </div>
            </div>
          </List.Item>
        );
      }}
      loadMore={async () => {
        fetchNextPage();
      }}
      hasMore={hasNextPage}
      onRefresh={refetch}
    />
  );
};

export default OtcOrderHistory;
