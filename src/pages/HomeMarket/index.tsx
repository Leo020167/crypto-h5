import { NavBar, Swiper, SwiperRef, Tabs } from 'antd-mobile';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import HomeStockDigitalMarket from './HomeStockDigitalMarket';

const ActiveIndexParam = withDefault(NumberParam, 0);

const HomeMarket = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const [activeIndex, setActiveIndex] = useQueryParam('tab', ActiveIndexParam);

  const intl = useIntl();
  const tabItems = useMemo(
    () => [
      { key: '0', title: intl.$t({ id: 'home.market.globalFutures' }) },
      { key: '1', title: intl.$t({ id: 'home.market.contracts' }) },
      { key: '2', title: intl.$t({ id: 'home.market.currency' }) },
    ],
    [intl],
  );

  return (
    <Container className="flex-1 flex flex-col min-h-0 bg-white">
      <NavBar back={null}>{intl.$t({ id: 'home.market' })}</NavBar>

      <Tabs
        className="flex items-center justify-center"
        activeKey={tabItems[activeIndex].key}
        onChange={(key) => {
          const index = Number(key);
          setActiveIndex(index, 'replaceIn');
          swiperRef.current?.swipeTo(index);
        }}
      >
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>

      <Swiper
        className="flex-1"
        direction="horizontal"
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={(index) => {
          setActiveIndex(index);
        }}
      >
        <Swiper.Item>
          <HomeStockDigitalMarket tab="stock" />
        </Swiper.Item>
        <Swiper.Item>
          <HomeStockDigitalMarket tab="digital" />
        </Swiper.Item>
        <Swiper.Item>
          <HomeStockDigitalMarket tab="spot" />
        </Swiper.Item>
      </Swiper>
    </Container>
  );
};

const Container = styled.div`
  .adm-nav-bar {
    border: 0;
  }
  .adm-tabs {
    color: #666175ae;
    font-weight: bold;
    --title-font-size: 14px;
    --active-line-height: 0;
    --adm-color-primary: #000;
    .adm-tabs-header {
      border: 0;
    }
  }
`;

export default HomeMarket;
