import { useInfiniteQuery } from '@tanstack/react-query';
import { List } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { articleHelpList, getArticleHelpListQueryKey } from '../../api/endpoints/transformer';
import { ArticleHelpListResponseAllOfDataAllOfDataItem } from '../../api/model';
import ScreenWithInfiniteScroll from '../../components/ScreenWithInfiniteScroll';
import { stringDateFormat } from '../../utils/date';

const HelpCenter = () => {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getArticleHelpListQueryKey({}),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await articleHelpList({ pageNo: pageParam });
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
      headerTitle={intl.formatMessage({ defaultMessage: '幫助中心', id: 'BRtAE8' })}
      dataSource={dataSource}
      renderItem={(item: ArticleHelpListResponseAllOfDataAllOfDataItem) => {
        return (
          <List.Item
            key={item.articleId}
            arrow={false}
            onClick={() => {
              if (item.url) {
                window.open(item.url);
              }
            }}
          >
            <div className="flex flex-col">
              <div className="truncate font-bold">{item.title}</div>
              <div className="text-right text-xs text-[#b6b6b6]">
                {stringDateFormat(item.createTime, 'YYYY-MM-DD HH:mm')}
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

export default HelpCenter;
