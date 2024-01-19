import { Swiper, SwiperRef, Tabs } from 'antd-mobile';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useHomeAccount } from '../../api/endpoints/transformer';
import HomeBalanceAccount from './HomeBalanceAccount';
import HomeDigitalAccount from './HomeDigitalAccount';
import HomeFollowAccount from './HomeFollowAccount';
import HomeSpotAccount from './HomeSpotAccount';
import HomeStockAccount from './HomeStockAccount';

const TabParam = withDefault(StringParam, '0');
const HomeAccount = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const [tab, setTab] = useQueryParam('tab', TabParam);

  const { data, refetch } = useHomeAccount();

  const intl = useIntl();
  const tabItems = useMemo(
    () => [
      { key: '0', title: intl.formatMessage({ defaultMessage: '餘額', id: 'hPHyre' }) },
      { key: '4', title: intl.formatMessage({ defaultMessage: '幣幣帳戶', id: 'l9VaC8' }) },
      // { key: '1', title: intl.formatMessage({ defaultMessage: '跟單帳戶', id: 'WDcvta' }) },
      // { key: '2', title: intl.formatMessage({ defaultMessage: '全球期指帳戶', id: 'L2Dpi5' }) },
      { key: '3', title: intl.formatMessage({ defaultMessage: '合約帳戶', id: 'VYKM4q' }) },
      
    ],
    [intl],
  );

  useInterval(() => refetch(), 1000);

  return (
    <Container className="h-screen min-h-0 relative flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col pt-10 px-4 pb-6 bg-[#4D4CE6] text-white">
          <div className="text-xs text-gray-200">
            {intl.formatMessage({ defaultMessage: '餘額賬戶總資產(USDT)', id: 'dKX04w' })}
          </div>
          <div className=" font-bold text-4xl my-1">{data?.data?.tolAssets ?? '0.00'}</div>
          <div className="text-base">{data?.data?.tolAssetsCny ?? '0.00'}</div>

          <div className="mt-4 gap-2 flex">
            <Link
              to="/recharge-coin"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded min-h-[40px] px-2"
            >
              {intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}
            </Link>
            <Link
              to="/take-coin"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded min-h-[40px] px-2"
            >
              {intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}
            </Link>
            <Link
              to="/transfer-coin"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded min-h-[40px] px-2"
            >
              {intl.formatMessage({ defaultMessage: '划轉', id: 'UD6XMk' })}
            </Link>
            <Link
              to="/legal-money"
              className="bg-[#6f6fe7] h-full flex flex-1 items-center justify-center rounded min-h-[40px] px-2"
            >
              {intl.formatMessage({ defaultMessage: '餘額提現', id: 'CkIqO9' })}
            </Link>
          </div>
        </div>
        <div className="sticky top-0 z-10 bg-white">
          <Tabs
            defaultActiveKey={tab}
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
        </div>

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

          <Swiper.Item key="HomeFollowAccount">
            {tab === '1' && (
              <HomeFollowAccount
                account={data?.data?.followAccount}
                followDv={data?.data?.followDv}
              />
            )}
          </Swiper.Item>
          <Swiper.Item key="HomeStockAccount">
            {tab === '2' && <HomeStockAccount account={data?.data?.stockAccount} />}
          </Swiper.Item>
          <Swiper.Item key="HomeDigitalAccount">
            {tab === '3' && <HomeDigitalAccount account={data?.data?.digitalAccount} />}
          </Swiper.Item>
          <Swiper.Item key="HomeSpotAccount">
            {tab === '4' && <HomeSpotAccount account={data?.data?.spotAccount} />}
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
