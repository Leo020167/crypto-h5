import { DotLoading } from 'antd-mobile';
import { useIntl } from 'react-intl';

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  const intl = useIntl();
  return (
    <>
      {hasMore ? (
        <>
          <span>Loading</span>
          <DotLoading />
        </>
      ) : (
        <span className="font-bold text-black dark:text-[#6175AE]">
          {intl.formatMessage({ defaultMessage: '已加载全部', id: '2a4k+m' })}
        </span>
      )}
    </>
  );
};

export default InfiniteScrollContent;
