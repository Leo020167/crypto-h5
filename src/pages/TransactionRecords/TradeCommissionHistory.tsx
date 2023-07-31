import { useInfiniteQuery } from '@tanstack/react-query';
import { Dialog, InfiniteScroll, Toast } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  getProOrderQueryListQueryKey,
  proOrderQueryList,
  useProOrderCancel,
} from '../../api/endpoints/transformer';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import { stringDateFormat } from '../../utils/date';

const TradeCommissionHistory = ({ accountType }: { accountType?: string }) => {
  const params = useMemo(
    () => ({
      isDone: accountType === 'spot' ? '-1' : '0',
      symbol: '',
      buySell: '',
      accountType,
      orderState: '0',
      type: accountType === 'spot' ? '2' : '1',
    }),
    [accountType],
  );

  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getProOrderQueryListQueryKey(params),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await proOrderQueryList({
        pageNo: pageParam,
        ...params,
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
      <div className="flex h-full w-full flex-col items-center">
        {dataSource.map((v: any, i) => (
          <div key={i} className="mb-4 w-full border-b bg-white p-4">
            <div className="flex items-center">
              <div className="flex flex-1 items-center">
                <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
                <span className="ml-2 text-xs text-gray-400">{'• ' + v.buySellValue}</span>
                <span className="ml-2 text-xs text-gray-400">{stringDateFormat(v.openTime)}</span>
              </div>

              <a
                className=" flex h-6 w-12 items-center justify-center border text-xs text-[#969696]"
                onClick={() => {
                  Dialog.confirm({
                    content: intl.formatMessage({ defaultMessage: '確定撤銷訂單', id: 'UXkrvR' }),
                    cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
                    confirmText: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
                    onConfirm() {
                      proOrderCancel.mutate({
                        data: {
                          orderId: v.orderId,
                          type: accountType === 'spot' ? '2' : '1',
                        },
                      });
                    },
                  });
                }}
              >
                {intl.formatMessage({ defaultMessage: '撤銷', id: 'hEtJ5h' })}
              </a>
            </div>
            <div className="mt-2.5 flex">
              <div className="flex w-1/3 flex-col">
                <span className="text-xs text-gray-400">
                  {accountType === 'spot'
                    ? intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })
                    : intl.formatMessage({ defaultMessage: '手數', id: 'g4FQPM' })}
                </span>
                <span className="text-sm text-[#3d3a50]">
                  {accountType === 'spot' ? v.amount : v.openHand}
                </span>
              </div>
              <div className="flex w-1/3 flex-col items-center">
                <span className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '委托價', id: 'ehbGQt' })}
                </span>
                <span className="text-sm text-[#3d3a50]">{v.price}</span>
              </div>
              <div className="flex w-1/3 flex-col items-end">
                <span className="text-xs text-gray-400">
                  {accountType === 'spot'
                    ? intl.formatMessage({ defaultMessage: '總金額(USDT)', id: 'jBc8s4' })
                    : intl.formatMessage({ defaultMessage: '開倉保證金', id: 'H4vld2' })}
                </span>
                <span className="text-sm text-[#3d3a50]">
                  {accountType === 'spot' ? v.sum : v.openBail}
                </span>
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
