import { DotLoading, InfiniteScroll, List, NavBar, PullToRefresh } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import defaultHead from '../../../assets/ic_default_head.png';

let count = 0;

export async function mockRequest() {
  if (count >= 1) {
    return [];
  }
  await sleep(2000);
  count++;
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
}

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

const NotificationList = () => {
  const history = useHistory();

  const [data, setData] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  async function loadMore() {
    const append = await mockRequest();
    setData((val) => [...val, ...append]);
    setHasMore(append.length > 0);
  }

  return (
    <div>
      <NavBar onBack={() => history.goBack()} className="bg-white fixed top-0 w-full z-10">
        系统通知
      </NavBar>
      <div className="pt-[45px]">
        <PullToRefresh
          onRefresh={async () => {
            await sleep(1000);
          }}
        >
          <List>
            {data.map((item, index) => (
              <List.Item key={index}>
                <div className="flex">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img alt="" src={defaultHead} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[#b6b6b6]">
                      <div>[FireUp]</div>
                      <div className="text-xs">2022-11-15 00:08</div>
                    </div>
                    <div className="font-bold">提币失败提示</div>
                    <div className="text-[#b6b6b6]">您的提订罩 10012106 未通，原因: test</div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>

          <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
            <InfiniteScrollContent hasMore={hasMore} />
          </InfiniteScroll>
        </PullToRefresh>
      </div>
    </div>
  );
};

export default NotificationList;
