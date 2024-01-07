import { InfiniteScroll, List, NavBar, NavBarProps, PullToRefresh } from 'antd-mobile';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScrollContent from './InfiniteScrollContent';

interface ScreenWithInfiniteScrollProps<T = any> {
  className?: string;
  headerTitle?: string;
  navBarProps?: NavBarProps;
  dataSource: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: (isRetry: boolean) => Promise<void>;
  hasMore: boolean;
  onRefresh?: () => Promise<any>;
}

const ScreenWithInfiniteScroll = ({
  className,
  headerTitle,
  navBarProps = {},
  dataSource = [],
  renderItem,
  loadMore,
  hasMore,
  onRefresh,
}: ScreenWithInfiniteScrollProps) => {
  const history = useHistory();

  const content = useMemo(() => dataSource.map(renderItem), [dataSource, renderItem]);

  return (
    <Container className={`relative h-screen bg-white dark:bg-[#161720] ${className ?? ''}`}>
      <NavBar
        onBack={() => history.goBack()}
        {...navBarProps}
        className="fixed top-0 z-10 w-full bg-white dark:bg-[#161720]"
      >
        {headerTitle}
      </NavBar>
      <div className="pt-[45px]">
        <PullToRefresh onRefresh={onRefresh}>
          <List>{content}</List>

          <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
            <InfiniteScrollContent hasMore={hasMore} />
          </InfiniteScroll>
        </PullToRefresh>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-list-default .adm-list-body {
    border: 0;
  }
`;

export default ScreenWithInfiniteScroll;
