import { useInfiniteQuery } from '@tanstack/react-query';
import { InfiniteScroll, List } from 'antd-mobile';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { depositList, getDepositListQueryKey } from '../../api/endpoints/transformer';
import { DepositWithdrawListItem } from '../../api/model';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import { stringDateFormat } from '../../utils/date';

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

  const intl = useIntl();

  const getName = useCallback(
    (data: DepositWithdrawListItem) => {
      switch (data.inOut) {
        case '1':
          return intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' });
        case '2':
          return intl.formatMessage(
            { defaultMessage: '申購凍結({a}-{b})', id: 'MeeLjX' },
            {
              a: data.subSymbol,
              b: data.subTitle,
            },
          );
        case '3':
          return intl.formatMessage(
            { defaultMessage: '申購成功轉換({a}-{b})', id: 'zeTkGR' },
            {
              a: data.subSymbol,
              b: data.subTitle,
            },
          );
        case '4':
          return intl.formatMessage(
            { defaultMessage: '申購失敗轉換({a}-{b})', id: 'meMA+Y' },
            {
              a: data.subSymbol,
              b: data.subTitle,
            },
          );
        default:
          return intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' });
      }
    },
    [intl],
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
                  <div>{intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}</div>
                  <div className="text-black">{v.amount}</div>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <div>{intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}</div>
                  <div className="text-black">{v.stateDesc}</div>
                </div>
              </div>
              <div className="flex items-center  justify-between">
                {v.inOut === '2' ? (
                  <div className="text-xs text-gray-400">
                    <div>{intl.formatMessage({ defaultMessage: '申購時間', id: 'PUWCuy' })}</div>
                    <div className="text-black">{stringDateFormat(v.createTime)}</div>
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="text-xs text-gray-400 text-right">
                  <div>{intl.formatMessage({ defaultMessage: '解倉時間', id: '/AVS2G' })}</div>
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
