import { useInfiniteQuery } from '@tanstack/react-query';
import { Dialog, InfiniteScroll, Toast } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  getDepositListQueryKey,
  proOrderQueryList,
  useProOrderCancel,
} from '../../api/endpoints/transformer';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import { stringDateFormat } from '../../utils/date';

const TradeCommissionHistory = ({ accountType }: { accountType?: string }) => {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getDepositListQueryKey({}),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await proOrderQueryList({
        pageNo: pageParam,
        isDone: '0',
        symbol: '',
        accountType: accountType,
        buySell: '',
        orderState: '',
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

  const proOrderCancel = useProOrderCancel({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  const intl = useIntl();

  if (dataSource.length === 0) {
    return (
      <span className="flex items-center justify-center p-10">
        {intl.formatMessage({ defaultMessage: '暫無數據', id: 'dqhJYx' })}
      </span>
    );
  }

  return (
    <InfiniteScroll
      className="p-0"
      loadMore={async () => {
        await fetchNextPage();
      }}
      hasMore={hasNextPage}
    >
      <div className="flex flex-col items-center h-full w-full">
        {dataSource.map((v, i) => (
          <div key={i} className="bg-white w-full p-4 mb-4 border-b">
            <div className="flex items-center">
              <div className="flex items-center flex-1">
                <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
                <span className="text-xs text-gray-400 ml-2">{v.buySellValue}</span>
                <span className="text-xs text-gray-400 ml-2">{stringDateFormat(v.openTime)}</span>
              </div>

              <a
                className=" h-6 w-12 border flex items-center justify-center text-xs text-[#969696]"
                onClick={() => {
                  Dialog.confirm({
                    content: intl.formatMessage({ defaultMessage: '確定撤銷訂單', id: 'UXkrvR' }),
                    confirmText: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
                    onConfirm() {
                      proOrderCancel.mutate({
                        data: {
                          orderId: v.orderId,
                        },
                      });
                    },
                  });
                }}
              >
                {intl.formatMessage({ defaultMessage: '撤銷', id: 'hEtJ5h' })}
              </a>
            </div>
            <div className="flex mt-2.5">
              <div className="flex flex-col w-1/3">
                <span className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '手數', id: 'g4FQPM' })}
                </span>
                <span className="text-sm text-[#3d3a50]">{v.openHand}</span>
              </div>
              <div className="flex flex-col w-1/3 items-center">
                <span className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '委托價', id: 'ehbGQt' })}
                </span>
                <span className="text-sm text-[#3d3a50]">{v.price}</span>
              </div>
              <div className="flex flex-col w-1/3 items-end">
                <span className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '開倉保證金', id: 'H4vld2' })}
                </span>
                <span className="text-sm text-[#3d3a50]">{v.openBail}</span>
              </div>
            </div>
          </div>
        ))}
        <InfiniteScrollContent hasMore={hasNextPage} />
      </div>
    </InfiniteScroll>
  );
};

export default TradeCommissionHistory;
