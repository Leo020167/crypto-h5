import { DotLoading, InfiniteScroll, List, NavBar, PullToRefresh } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Arrow } from '../../../assets/ic_svg_arrow_2.svg';

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

const TakeCoinHistory = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  async function loadMore() {
    const append = await mockRequest();
    setData((val) => [...val, ...append]);
    setHasMore(append.length > 0);
  }

  return (
    <div>
      <NavBar onBack={() => navigate(-1)} className="bg-white fixed top-0 w-full z-10">
        财务记录
      </NavBar>
      <div className="pt-[45px]">
        <PullToRefresh
          onRefresh={async () => {
            await sleep(1000);
          }}
        >
          <List>
            {data.map((item, index) => (
              <List.Item
                key={index}
                arrow={null}
                title={
                  <div className="flex justify-between items-center">
                    <span className="text-[#677ba8]">提币</span>
                    <Arrow />
                  </div>
                }
                onClick={() => {
                  navigate('/take-coin-history-details');
                }}
              >
                <div className="flex text-xs mt-2">
                  <div className="flex flex-col w-1/3">
                    <span className="text-[#b0b5ba]">数量</span>
                    <span className="text-[#4e5963] mt-1">1000.0000000</span>
                  </div>
                  <div className="flex flex-col w-1/3 text-center">
                    <span className="text-[#b0b5ba]">状态</span>
                    <span className="text-[#4e5963] mt-1">已成功</span>
                  </div>
                  <div className="flex flex-col w-1/3 text-right">
                    <span className="text-[#b0b5ba]">时间</span>
                    <span className="text-[#4e5963] mt-1">2022-11-15 00:08</span>
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

export default TakeCoinHistory;
