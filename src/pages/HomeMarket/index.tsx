import { NavBar, Swiper, SwiperRef, Tabs } from 'antd-mobile';
import { SearchOutline } from 'antd-mobile-icons';
import { stringify } from 'query-string';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
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
      {
        key: '0',
        title: intl.formatMessage({ defaultMessage: '幣幣', id: 'UT6tN2' }),
        tab: 'spot',
      },
    ],
    [intl],
  );

  const currentTab = useMemo(() => tabItems[activeIndex], [activeIndex, tabItems]);

  return (
    <Container className="flex-1 flex flex-col min-h-0 bg-white">
      <NavBar
        back={null}
        right={
          <div className="flex justify-end">
            <Link
              to={{
                pathname: '/search-coin',
                search: stringify({ accountType: currentTab.tab }),
              }}
            >
              <SearchOutline fontSize={16} />
            </Link>
          </div>
        }
      >
        {intl.formatMessage({ defaultMessage: '行情', id: 'Hv1Nr8' })}
      </NavBar>

      <Tabs
        className="flex items-center justify-center"
        activeKey={currentTab.key}
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
          <HomeStockDigitalMarket tab="spot" activeKey={currentTab.tab} />
        </Swiper.Item>
        <Swiper.Item>
          <HomeStockDigitalMarket tab="digital" activeKey={currentTab.tab} />
        </Swiper.Item>
        <Swiper.Item>
          <HomeStockDigitalMarket tab="stock" activeKey={currentTab.tab} />
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
