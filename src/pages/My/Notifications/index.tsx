import { InfiniteScroll, List, NavBar, PullToRefresh } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

let count = 0;

export async function mockRequest() {
  if (count >= 5) {
    return [];
  }
  await sleep(2000);
  count++;
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
}

const NotificationList = () => {
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
              <List.Item key={index}>{item}</List.Item>
            ))}
          </List>

          <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </PullToRefresh>
      </div>
    </div>
  );
};

export default NotificationList;
