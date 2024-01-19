import {useInfiniteQuery} from '@tanstack/react-query';
import {Dialog, InfiniteScroll, List, Toast} from 'antd-mobile';
import {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {getSubscribeRecordListQueryKey, subscribeRecordList, useApplyPaid} from '../../api/endpoints/transformer';
import InfiniteScrollContent from '../../components/InfiniteScrollContent';
import {stringDateFormat} from '../../utils/date';
import {
  SubscribeRecordListResponseAllOfDataAllOfDataItem
} from "../../api/model/subscribeRecordListResponseAllOfDataAllOfDataItem";

const FinancialList = () => {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: getSubscribeRecordListQueryKey({}),
    queryFn: async ({pageParam = 1}) => {
      const res = await subscribeRecordList({pageNo: pageParam});
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
    (data: SubscribeRecordListResponseAllOfDataAllOfDataItem) => {
      return intl.formatMessage(
        {defaultMessage: '申購({a}-{b})', id: 'MeeLjX'},
        {
          a: data.symbol,
          b: data.title,
        },
      );
    },
    [intl],
  );

  const applyPaid = useApplyPaid({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  return (
    <div>
      <List>
        {dataSource.map((v, i) => (
          <List.Item key={i}>
            <div className="px-4">
              <div className="text-[#c6175ae]">{getName(v)}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <div>{intl.formatMessage({defaultMessage: '申购数量', id: 's9R592'})}</div>
                  <div className="text-black">{v.count}</div>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <div>{intl.formatMessage({defaultMessage: '申購時間', id: 'PUWCuy'})}</div>
                  <div className="text-black">{stringDateFormat(v.time)}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <div>{intl.formatMessage({defaultMessage: '中签数量', id: 'KLJG35'})}</div>
                  <div className="text-black">{v.luckyCount ?? 0}</div>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <div>{intl.formatMessage({defaultMessage: '狀態', id: 'NL+iCs'})}</div>
                  <div className="text-black">{v.stateDesc}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <div className="flex">
                    <div>
                      <div>{intl.formatMessage({defaultMessage: '已缴款（USDT）', id: '89g4Jo'})}</div>
                      <div className="text-black">{v.paidAmount ?? 0}</div>
                    </div>
                    {/*{!!v?.state && v.state == '1' && (*/}
                    {/*  <div>*/}
                    {/*    <a*/}
                    {/*      className="flex h-8 w-22 items-center justify-center rounded px-4 text-red-600 border-red-600 border text-base"*/}
                    {/*      onClick={() => {*/}
                    {/*        Dialog.confirm({*/}
                    {/*          title: intl.formatMessage({defaultMessage: '提示', id: 'kCh5Jz'}),*/}
                    {/*          content: intl.formatMessage({defaultMessage: '确认缴款吗？', id: 'H784JK'}),*/}
                    {/*          confirmText: intl.formatMessage({defaultMessage: '确认', id: '6509KL'}),*/}
                    {/*          cancelText: intl.formatMessage({defaultMessage: '取消', id: '2QzYmY'}),*/}
                    {/*          onConfirm() {*/}
                    {/*            applyPaid.mutate({*/}
                    {/*              data: {*/}
                    {/*                recordId: v.id ?? ''*/}
                    {/*              },*/}
                    {/*            });*/}
                    {/*          },*/}
                    {/*        });*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      缴款*/}
                    {/*    </a>*/}
                    {/*  </div>*/}
                    {/*)}*/}
                  </div>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <div>{intl.formatMessage({defaultMessage: '未缴款（USDT）', id: 'ivjrgh'})}</div>
                  <div className="text-black">{v.unpaidAmount ?? 0}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center  justify-between">
                <div className="text-xs text-gray-400">
                  <div>{intl.formatMessage({defaultMessage: '上市交易时间', id: 'zS9FwU'})}</div>
                  <div className="text-black">{stringDateFormat(v.tradeTime)}</div>
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
        <InfiniteScrollContent hasMore={hasNextPage}/>
      </InfiniteScroll>
    </div>
  );
};

export default FinancialList;
