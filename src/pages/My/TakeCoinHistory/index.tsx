import { useInfiniteQuery } from '@tanstack/react-query';
import { List } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { depositList, getDepositListQueryKey } from '../../../api/endpoints/transformer';
import { DepositListResponseAllOfDataAllOfDataItem } from '../../../api/model';

import { ReactComponent as Arrow } from '../../../assets/ic_svg_arrow_2.svg';
import ScreenWithInfiniteScroll from '../../../components/ScreenWithInfiniteScroll';
import { stringDateFormat } from '../../../utils/date';

const TakeCoinHistory = () => {
  const history = useHistory();

  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getDepositListQueryKey({}),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await depositList({ pageNo: pageParam });
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

  return (
    <ScreenWithInfiniteScroll
      headerTitle={intl.formatMessage({ defaultMessage: '財務記錄', id: 'gtC59I' })}
      dataSource={dataSource}
      renderItem={(item: DepositListResponseAllOfDataAllOfDataItem, index) => {
        return (
          <List.Item
            key={index}
            arrow={null}
            title={
              <div className="flex items-center justify-between">
                <span className="text-[#677ba8]">
                  {item.inOut === '1'
                    ? intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })
                    : intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}
                </span>
                <Arrow />
              </div>
            }
            onClick={() => {
              history.push({
                pathname: '/take-coin-history-details',
                state: item,
              });
            }}
          >
            <div className="mt-2 flex text-xs">
              <div className="flex w-1/3 flex-col">
                <span className="text-[#b0b5ba]">
                  {intl.formatMessage(
                    { defaultMessage: '數量({symbol})', id: 'MkphXA' },
                    {
                      symbol: item.symbol,
                    },
                  )}
                </span>
                <span className="mt-1 text-[#4e5963]">{item.amount}</span>
              </div>
              <div className="flex w-1/3 flex-col text-center">
                <span className="text-[#b0b5ba]">
                  {intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
                </span>
                <span className="mt-1 text-[#4e5963]">{item.stateDesc}</span>
              </div>
              <div className="flex w-1/3 flex-col text-right">
                <span className="text-[#b0b5ba]">
                  {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
                </span>
                <span className="mt-1 text-[#4e5963]">{stringDateFormat(item.createTime)}</span>
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

export default TakeCoinHistory;
