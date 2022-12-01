import { useInfiniteQuery } from '@tanstack/react-query';
import { InfiniteScroll, List } from 'antd-mobile';
import { stringify } from 'query-string';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { getProOrderQueryListQueryKey, proOrderQueryList } from '../../api/endpoints/transformer';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import Record from './Record';
import Spot from './Spot';

export interface TradeLeverHistoryRef {
  refetch: () => void;
}
interface TradeLeverHistoryProps {
  accountType?: string;
  symbol?: string;
  orderState?: string;
}

const TradeLeverHistory = forwardRef<TradeLeverHistoryRef, TradeLeverHistoryProps>(
  ({ accountType, symbol = '', orderState = '' }, ref) => {
    const {
      data,
      hasNextPage = false,
      fetchNextPage,
      refetch,
    } = useInfiniteQuery({
      queryKey: getProOrderQueryListQueryKey({}),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await proOrderQueryList({
          pageNo: pageParam,
          isDone: '-1',
          symbol: symbol ?? '',
          orderState: orderState ?? '',
          type: accountType === 'spot' ? '2' : '',
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

    useImperativeHandle(ref, () => ({ refetch }));

    const history = useHistory();

    return (
      <div>
        <List>
          {dataSource.map((v, index) => (
            <List.Item
              key={index}
              onClick={() =>
                history.push({
                  pathname: '/lever-info',
                  search: stringify({
                    orderId: v.orderId,
                  }),
                })
              }
            >
              {accountType === '2' ? <Spot data={v} /> : <Record data={v} />}
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
