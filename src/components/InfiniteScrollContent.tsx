import { DotLoading } from 'antd-mobile';

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

export default InfiniteScrollContent;
