import { List, NoticeBar, Swiper, Tabs } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useHomeAccount, useHomeCropMe } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';
import lvjiantou from '../../assets/lvjiantou.png';

import tab1_menu1 from '../../assets/tab1_menu1.png';
import tab1_menu2 from '../../assets/tab1_menu2.png';
import tab1_menu3 from '../../assets/tab1_menu3.png';
import tab1_menu4 from '../../assets/tab1_menu4.png';
import tab1_menu5 from '../../assets/tab1_menu5.png';
import tab2_2 from '../../assets/tab2_2.png';
import xiaolaba from '../../assets/xiaolaba.png';
import { localeAtom, switchColorValueAtom, userAtom } from '../../atoms';
import { useMarketData, useQuoteHomePage } from '../../market/endpoints/marketWithTransformer';
import { Quote } from '../../market/model';
import { getOriginSymbol, getUnitSymbol } from '../TransactionRecords/utils';

const Home = () => {
  const locale = useAtomValue(localeAtom);

  const user = useAtomValue(userAtom);

  const { data: homeAccount } = useHomeAccount();

  const { data: homeCropMe } = useHomeCropMe();

  const { data: quoteHomePage } = useQuoteHomePage();

  const [sortType, setSortType] = useState<string>('1');
  const { data: marketData } = useMarketData({
    sortField: 'rate',
    sortType: sortType,
    tab: 'stock',
  });

  const notice = useMemo(() => {
    if (homeCropMe?.data?.noticeList?.length) {
      return homeCropMe.data.noticeList.map((v) => v.title ?? '').join('; ');
    }
    return '';
  }, [homeCropMe]);

  const quotes = useMemo(() => quoteHomePage?.data?.quotes ?? [], [quoteHomePage?.data?.quotes]);

  const switchColorValue = useAtomValue(switchColorValueAtom);

  const getColor = useCallback(
    (value: number) => {
      if (switchColorValue === '1') {
        return value < 0 ? '#EA3941' : '#00BA76';
      } else {
        return value < 0 ? '#00BA76' : '#EA3941';
      }
    },
    [switchColorValue],
  );

  return (
    <Container className="bg-[#eef3f9] flex-1 overflow-y-auto px-2.5">
      <div className="mt-5 flex items-center">
        <img alt="" src={user?.headUrl ?? ic_default_head} className="w-10 h-10 rounded-full" />

        <div className="flex-1 flex justify-center">
          <img alt="" src={tab2_2} className="w-[76px] h-[31px] " />
        </div>

        <Link to="/languages">
          <img alt="" src={`/public/languages/${locale}.png`} className="w-6 h-6 rounded-full" />
        </Link>
      </div>

      <div className="mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden">
        <Swiper autoplay loop>
          {homeAccount?.data?.banner?.map((v) => (
            <Swiper.Item key={v.bannerId} className="h-[150px] flex flex-col">
              <img alt="" src={v.imageUrl} className="w-full h-full" />
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      <div className="mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden h-12">
        <NoticeBar
          icon={<img alt="" src={xiaolaba} className="w-5 h-5" />}
          content={notice}
          extra={<img alt="" src={lvjiantou} className="w-5 h-4" />}
        />
      </div>

      <div className="text-sm font-bold mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden h-28 px-2.5 flex items-center">
        {quotes.map((v, i) => (
          <div className="flex flex-col items-center w-1/3" key={i}>
            <div className="text-xs text-[#0C0C0C]">
              {[v.symbol, v.currency].filter(Boolean).join('/')}
            </div>
            <div
              className="mt-2 text-sm text-[#EA3941]"
              style={{ color: getColor(v.rate?.includes('-') ? -1 : 1) }}
            >
              {v.rate}%
            </div>
            <div
              className="mt-1 text-base text-[#EA3941] leading-4"
              style={{ color: getColor(v.rate?.includes('-') ? -1 : 1) }}
            >
              {v.price}
            </div>
            <div className="mt-2 text-xs text-[#888888]">{v.priceCny}</div>
          </div>
        ))}
      </div>

      <div className="text-sm font-bold mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden h-[100px] px-2.5 flex items-center">
        <Link to="" className="flex flex-col items-center justify-center w-1/5">
          <img alt="" src={tab1_menu1} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666]">金牌機构</div>
        </Link>
        <Link to="" className="flex flex-col items-center justify-center w-1/5">
          <img alt="" src={tab1_menu2} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666]">創新試驗區</div>
        </Link>
        <Link to="" className="flex flex-col items-center justify-center w-1/5">
          <img alt="" src={tab1_menu3} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666]">OTC交易</div>
        </Link>
        <Link to="" className="flex flex-col items-center justify-center w-1/5">
          <img alt="" src={tab1_menu4} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666]">線上客服</div>
        </Link>
        <Link to="" className="flex flex-col items-center justify-center w-1/5">
          <img alt="" src={tab1_menu5} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666]">質押生息</div>
        </Link>
      </div>

      <div className="text-sm font-bold my-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden flex items-center">
        <Tabs
          className="w-full"
          onChange={(key) => {
            setSortType(key);
          }}
        >
          <Tabs.Tab title="漲幅榜" key="1" className="text-[#A2A9BC]" destroyOnClose>
            <div className="flex items-center px-3">
              <div className="text-sm w-1/3">名稱</div>
              <div className="text-sm w-1/3 text-center">最新價</div>
              <div className="text-sm w-1/3 text-right">漲跌幅</div>
            </div>
            <Symbols quotes={marketData?.data?.quotes} />
          </Tabs.Tab>
          <Tabs.Tab title="跌幅榜" key="2" destroyOnClose>
            <div className="flex items-center px-3">
              <div className="text-sm w-1/3">名稱</div>
              <div className="text-sm w-1/3 text-center">最新價</div>
              <div className="text-sm w-1/3 text-right">漲跌幅</div>
            </div>
            <Symbols quotes={marketData?.data?.quotes} />
          </Tabs.Tab>
        </Tabs>
      </div>
    </Container>
  );
};

const Symbols = ({ quotes = [] }: { quotes?: Quote[] }) => {
  const switchColorValue = useAtomValue(switchColorValueAtom);
  const getColor = useCallback(
    (value: number) => {
      if (switchColorValue === '1') {
        return value < 0 ? '#EA3941' : '#00BA76';
      } else {
        return value < 0 ? '#00BA76' : '#EA3941';
      }
    },
    [switchColorValue],
  );

  return (
    <List className="mt-4">
      {quotes?.map((v, i) => (
        <List.Item key={i}>
          <div className="flex items-center">
            <div className="text-sm w-1/3">
              <div className="text-base text-black font-bold">
                {v.symbol?.includes('/') ? getOriginSymbol(v.symbol) : v.symbol}
                {v.symbol?.includes('/') ? '/' + getUnitSymbol(v.symbol) : ''}
              </div>
              <div className="text-xs text-[#A2A9BC]">{v.name}</div>
            </div>
            <div className="text-sm w-1/3 text-center">
              <div className="text-base text-black font-bold">{v.price}</div>
              <div className="text-xs text-[#A2A9BC]">量 {v.amount}</div>
            </div>
            <div className="text-sm w-1/3 flex flex-col items-end">
              <div
                className="text-base text-white bg-[#F32A44] min-w-[80px] max-w-full  h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: getColor(v.rate?.includes('-') ? -1 : 1) }}
              >
                {v.rate}%
              </div>
            </div>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

const Container = styled.div`
  .adm-tabs {
    color: #999999;
    --title-font-size: 16px;
    --active-line-height: 3px;
    --active-line-color: #0bbb79;
    --active-title-color: #333;

    .adm-tabs-header {
      border: 0;
    }
  }
  .adm-notice-bar {
    --background-color: #fff;
    --border-color: #fff;
    --text-color: #555555;
    --height: 100%;
    --font-size: 14px;
    .adm-notice-bar-left {
      margin-right: 14px;
    }
  }
`;

export default Home;
