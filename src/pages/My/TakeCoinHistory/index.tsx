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
              <div className="flex justify-between items-center">
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
            <div className="flex text-xs mt-2">
              <div className="flex flex-col w-1/3">
                <span className="text-[#b0b5ba]">
                  {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
                </span>
                <span className="text-[#4e5963] mt-1">{item.amount}</span>
              </div>
              <div className="flex flex-col w-1/3 text-center">
                <span className="text-[#b0b5ba]">
                  {intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
                </span>
                <span className="text-[#4e5963] mt-1">{item.stateDesc}</span>
              </div>
              <div className="flex flex-col w-1/3 text-right">
                <span className="text-[#b0b5ba]">
                  {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
                </span>
                <span className="text-[#4e5963] mt-1">{stringDateFormat(item.createTime)}</span>
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
