import { NavBar, PullToRefresh, List, InfiniteScroll, DotLoading, NavBarProps } from 'antd-mobile';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  const navigate = useNavigate();

  const content = useMemo(() => dataSource.map(renderItem), [dataSource, renderItem]);

  return (
    <Container className={`bg-white h-screen relative ${className ?? ''}`}>
      <NavBar
        onBack={() => navigate(-1)}
        {...navBarProps}
        className="bg-white fixed top-0 w-full z-10"
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

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <span>Loading</span>
          <DotLoading />
        </>
      ) : (
        <span className="font-bold text-black">已加载全部</span>
      )}
    </>
  );
};

const Container = styled.div`
  .adm-list-default .adm-list-body {
    border: 0;
  }
`;

export default ScreenWithInfiniteScroll;
