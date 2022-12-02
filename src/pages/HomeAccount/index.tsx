import { Swiper, SwiperRef, Tabs } from 'antd-mobile';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useHomeAccount } from '../../api/endpoints/transformer';
import HomeBalanceAccount from './HomeBalanceAccount';
import HomeDigitalAccount from './HomeDigitalAccount';
import HomeFollowAccount from './HomeFollowAccount';
import HomeSpotAccount from './HomeSpotAccount';
import HomeStockAccount from './HomeStockAccount';
import HomeTokenAccount from './HomeTokenAccount';

const tabItems = [
  { key: '0', title: '餘額' },
  { key: '1', title: 'TFU' },
  { key: '2', title: '跟單帳戶' },
  { key: '3', title: '全球期指帳戶' },
  { key: '4', title: '合約帳戶' },
  { key: '5', title: '幣幣帳戶' },
];

const HomeAccount = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const [tab, setTab] = useQueryParam('tab', StringParam);

  const { data } = useHomeAccount();

  // TODO 什麽情況下會定時更新
  // useInterval(() => refetch(), 1000);

  return (
    <Container className="h-screen min-h-0 relative flex flex-col bg-gray-100">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col pt-10 px-4 pb-6 bg-[#4D4CE6] text-white">
          <div className="text-xs text-gray-200">賬戶總資產(USDT)</div>
          <div className=" font-bold text-4xl my-1">{data?.data?.tolAssets ?? '0.00'}</div>
          <div className="text-base">{data?.data?.tolAssetsCny ?? '0.00'}</div>

          <div className="h-10 mt-4 gap-2 flex">
            <Link
              to="/recharge-coin"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded"
            >
              充幣
            </Link>
            <Link
              to="/take-coin"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded"
            >
              提幣
            </Link>
            <Link
              to="/transfer-coin"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded"
            >
              划轉
            </Link>
            <Link
              to="/legal-money"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded"
            >
              法幣購買
            </Link>
          </div>
        </div>
        <Tabs
          defaultActiveKey={tab}
          className="sticky top-0 z-10 bg-white"
          stretch={false}
          activeKey={tab}
          onChange={(key) => {
            const index = Number(key);
            setTab(key, 'replaceIn');

            swiperRef.current?.swipeTo(index);
          }}
        >
          {tabItems.map((item) => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>

        <Swiper
          direction="horizontal"
          indicator={() => null}
          ref={swiperRef}
          defaultIndex={Number(tab)}
          onIndexChange={(index) => {
            setTab(String(index), 'replaceIn');
          }}
        >
          <Swiper.Item key="HomeBalanceAccount">
            {tab === '0' && <HomeBalanceAccount account={data?.data?.balanceAccount} />}
          </Swiper.Item>
          <Swiper.Item key="HomeTokenAccount">
            {tab === '1' && <HomeTokenAccount account={data?.data?.tokenAccount} />}
          </Swiper.Item>
          <Swiper.Item key="HomeFollowAccount">
            {tab === '2' && (
              <HomeFollowAccount
                account={data?.data?.followAccount}
                followDv={data?.data?.followDv}
              />
            )}
          </Swiper.Item>
          <Swiper.Item key="HomeStockAccount">
            {tab === '3' && <HomeStockAccount account={data?.data?.stockAccount} />}
          </Swiper.Item>
          <Swiper.Item key="HomeDigitalAccount">
            {tab === '4' && <HomeDigitalAccount account={data?.data?.digitalAccount} />}
          </Swiper.Item>
          <Swiper.Item key="HomeSpotAccount">
            {tab === '5' && <HomeSpotAccount account={data?.data?.spotAccount} />}
          </Swiper.Item>
        </Swiper>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-tabs {
    color: #666175ae;
    font-weight: bold;
    --adm-font-size-9: 14px;
    --adm-color-primary: #4d4ce6;
    --active-line-height: 4px;
    --active-line-border-radius: 0;
  }
`;

export default HomeAccount;
