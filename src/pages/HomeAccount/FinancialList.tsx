import { useInfiniteQuery } from '@tanstack/react-query';
import { InfiniteScroll, List } from 'antd-mobile';
import { useMemo } from 'react';
import { depositList, getDepositListQueryKey } from '../../api/endpoints/transformer';
import { DepositWithdrawListItem } from '../../api/model';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import { stringDateFormat } from '../../utils/date';

const getName = (data: DepositWithdrawListItem) => {
  switch (data.inOut) {
    case '1':
      return '充幣';
    case '2':
      return `申購凍結(${data.subSymbol}-${data.subTitle})`;
    case '3':
      return `申購成功轉換(${data.subSymbol}-${data.subTitle})`;
    case '4':
      return `申購失敗轉換(${data.subSymbol}-${data.subTitle})`;
    default:
      return '提幣';
  }
};
const FinancialList = () => {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: getDepositListQueryKey({}),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await depositList({ pageNo: pageParam, inOut: '', type: 2 });
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

  return (
    <div>
      <List>
        {dataSource.map((v, i) => (
          <List.Item key={i}>
            <div className="px-4">
              <div className="text-[#c6175ae]">{getName(v)}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <div>數量</div>
                  <div className="text-black">{v.amount}</div>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <div>狀態</div>
                  <div className="text-black">{v.stateDesc}</div>
                </div>
              </div>
              <div className="flex items-center  justify-between">
                {v.inOut === '2' ? (
                  <div className="text-xs text-gray-400">
                    <div>申購時間</div>
                    <div className="text-black">{stringDateFormat(v.createTime)}</div>
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="text-xs text-gray-400 text-right">
                  <div>解倉時間</div>
                  <div className="text-black">{stringDateFormat(v.transferTime)}</div>
                </div>
              </div>
            </div>
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
};

export default FinancialList;
