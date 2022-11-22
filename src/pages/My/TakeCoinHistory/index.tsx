import { useInfiniteQuery } from '@tanstack/react-query';
import { List } from 'antd-mobile';
import { useMemo } from 'react';
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

  return (
    <ScreenWithInfiniteScroll
      headerTitle="财务记录"
      dataSource={dataSource}
      renderItem={(item: DepositListResponseAllOfDataAllOfDataItem, index) => {
        return (
          <List.Item
            key={index}
            arrow={null}
            title={
              <div className="flex justify-between items-center">
                <span className="text-[#677ba8]">{item.inOut === '1' ? '充币' : '提币'}</span>
                <Arrow />
              </div>
            }
            onClick={() => {
              history.push('/take-coin-history-details', {
                state: item,
              });
            }}
          >
            <div className="flex text-xs mt-2">
              <div className="flex flex-col w-1/3">
                <span className="text-[#b0b5ba]">数量</span>
                <span className="text-[#4e5963] mt-1">1000.0000000</span>
              </div>
              <div className="flex flex-col w-1/3 text-center">
                <span className="text-[#b0b5ba]">状态</span>
                <span className="text-[#4e5963] mt-1">{item.stateDesc}</span>
              </div>
              <div className="flex flex-col w-1/3 text-right">
                <span className="text-[#b0b5ba]">时间</span>
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
