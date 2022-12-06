import { useInfiniteQuery } from '@tanstack/react-query';
import { List } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { messageFind, getMessageFindQueryKey } from '../../../api/endpoints/transformer';
import { MessageFindResponseAllOfDataAllOfDataItem } from '../../../api/model';

import defaultHead from '../../../assets/ic_default_head.png';
import ScreenWithInfiniteScroll from '../../../components/ScreenWithInfiniteScroll';
import { stringDateFormat } from '../../../utils/date';

const NotificationList = () => {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getMessageFindQueryKey({}),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await messageFind({ pageNo: pageParam });
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
      headerTitle={intl.formatMessage({ defaultMessage: '系統消息', id: 'VEmd9D' })}
      dataSource={dataSource}
      renderItem={(item: MessageFindResponseAllOfDataAllOfDataItem, index) => {
        return (
          <List.Item key={index}>
            <div className="flex">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img alt="" src={item.headUrl ?? defaultHead} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center text-[#b6b6b6]">
                  <div>{item.userName}</div>
                  <div className="text-xs">
                    {stringDateFormat(item.createTime, 'YYYY-MM-DD HH:mm')}
                  </div>
                </div>
                <div className="font-bold">{item.title}</div>
                <div className="text-[#b6b6b6]">{item.content}</div>
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

export default NotificationList;
