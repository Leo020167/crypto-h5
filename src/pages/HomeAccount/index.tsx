import { Swiper, SwiperRef, Tabs } from 'antd-mobile';
import { useRef, useState } from 'react';
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
  const [tab, setTab] = useQueryParam('tab', StringParam);
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data } = useHomeAccount();

  // TODO 什麽情況下會定時更新
  // useInterval(() => refetch(), 1000);

  return (
    <Container className="h-screen min-h-0 relative flex flex-col bg-white">
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
          defaultActiveKey="0"
          className="sticky top-0 z-10 bg-white"
          stretch={false}
          activeKey={tab}
          onChange={(key) => {
            const index = Number(key);
            setTab(key, 'replaceIn');
            setActiveIndex(index);
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
          defaultIndex={activeIndex}
          onIndexChange={(index) => {
            setActiveIndex(index);
          }}
        >
          <Swiper.Item key="HomeBalanceAccount">
            <div style={{ display: activeIndex === 0 ? '' : 'none' }}>
              <HomeBalanceAccount account={data?.data?.balanceAccount} />
            </div>
          </Swiper.Item>
          <Swiper.Item key="HomeTokenAccount">
            <div style={{ display: activeIndex === 1 ? '' : 'none' }}>
              <HomeTokenAccount account={data?.data?.tokenAccount} />
            </div>
          </Swiper.Item>
          <Swiper.Item key="HomeFollowAccount">
            <div style={{ display: activeIndex === 2 ? '' : 'none' }}>
              <HomeFollowAccount account={data?.data?.followAccount} />
            </div>
          </Swiper.Item>
          <Swiper.Item key="HomeStockAccount">
            <div style={{ display: activeIndex === 3 ? '' : 'none' }}>
              <HomeStockAccount account={data?.data?.stockAccount} />
            </div>
          </Swiper.Item>
          <Swiper.Item key="HomeDigitalAccount">
            <div style={{ display: activeIndex === 4 ? '' : 'none' }}>
              <HomeDigitalAccount account={data?.data?.digitalAccount} />
            </div>
          </Swiper.Item>
          <Swiper.Item key="HomeSpotAccount">
            <div style={{ display: activeIndex === 5 ? '' : 'none' }}>
              <HomeSpotAccount account={data?.data?.spotAccount} />
            </div>
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
