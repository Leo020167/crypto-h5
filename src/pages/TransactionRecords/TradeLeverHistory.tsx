import { useInfiniteQuery } from '@tanstack/react-query';
import { InfiniteScroll, List } from 'antd-mobile';
import { stringify } from 'query-string';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { getProOrderQueryListQueryKey, proOrderQueryList } from '../../api/endpoints/transformer';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import Record from './Record';
import Record2 from './Record2';

export interface TradeLeverHistoryRef {
  refetch: () => void;
}
interface TradeLeverHistoryProps {
  accountType?: string;
  symbol?: string;
  orderState?: string;
}
/**
 * 歷史記錄，絕對正確參數
 */
const TradeLeverHistory = forwardRef<TradeLeverHistoryRef, TradeLeverHistoryProps>(
  ({ accountType, orderState, symbol = '' }, ref) => {
    const params = useMemo(
      () => ({
        isDone: '-1',
        symbol: symbol ?? '',
        buySell: '',
        accountType,
        orderState: orderState ?? '1',
        type: accountType === 'spot' ? '2' : '1',
      }),
      [accountType, orderState, symbol],
    );

    const {
      data,
      hasNextPage = false,
      fetchNextPage,
      refetch,
    } = useInfiniteQuery({
      queryKey: getProOrderQueryListQueryKey(params),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await proOrderQueryList({ pageNo: pageParam, ...params });
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

    useImperativeHandle(ref, () => ({ refetch }));

    const history = useHistory();

    return (
      <div>
        <List>
          {dataSource.map((v, index) => (
            <List.Item
              key={index}
              arrow={false}
              onClick={() => {
                if (accountType === 'spot') {
                  // history.push({
                  //   pathname: '/position-details',
                  //   search: stringify({
                  //     symbol: v.symbol,
                  //   }),
                  // });
                } else {
                  history.push({
                    pathname: '/lever-info',
                    search: stringify({
                      orderId: v.orderId,
                    }),
                  });
                }
              }}
            >
              {accountType === 'spot' ? <Record2 data={v} /> : <Record data={v} />}
            </List.Item>
          ))}
        </List>
        <InfiniteScroll
          loadMore={async () => {
            await fetchNextPage();
          }}
          hasMore={hasNextPage}
        >
          <InfiniteScrollContent hasMore={hasNextPage} />
        </InfiniteScroll>
      </div>
    );
  },
);

TradeLeverHistory.displayName = 'TradeLeverHistory';

export default TradeLeverHistory;
