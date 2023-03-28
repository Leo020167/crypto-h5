import { List, Swiper, Tabs } from 'antd-mobile';
import { ArrowDownCircleOutline } from 'antd-mobile-icons';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useHomeConfig, useHomeCropMe } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';
import lvjiantou from '../../assets/lvjiantou.png';

import tab1_menu2 from '../../assets/tab1_menu2.png';
import tab1_menu3 from '../../assets/tab1_menu3.png';
import tab1_menu4 from '../../assets/tab1_menu4.png';
import tab1_menu5 from '../../assets/tab1_menu5.png';

import xiaolaba from '../../assets/xiaolaba.png';
import { localeStateAtom, switchColorValueAtom } from '../../atoms';
import { useMarketData, useQuoteHomePage } from '../../market/endpoints/marketWithTransformer';
import { Quote } from '../../market/model';
import { useAuthStore } from '../../stores/auth';
import { getOriginSymbol, getUnitSymbol } from '../TransactionRecords/utils';

const Home = () => {
  const localeState = useAtomValue(localeStateAtom);

  const { userInfo } = useAuthStore();

  const { data: homeCropMe } = useHomeCropMe();

  const { data: homeConfig } = useHomeConfig();

  const { data: quoteHomePage } = useQuoteHomePage();

  const [sortType, setSortType] = useState<string>('1');
  const { data: marketData } = useMarketData({
    sortField: 'rate',
    sortType: sortType,
    tab: 'stock',
  });

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

  const intl = useIntl();

  return (
    <Container className="bg-[#eef3f9] flex-1 overflow-y-auto px-2.5">
      <div className="mt-5 flex items-center">
        <Link to="/home/my">
          <img
            alt=""
            src={userInfo?.headUrl ?? ic_default_head}
            className="w-10 h-10 rounded-full"
          />
        </Link>

        <div className="flex-1 flex justify-center"></div>

        <div className="flex items-center">
          {!!import.meta.env.VITE_ALLOW_DOWNLOAD && homeConfig?.data?.downloadUrl && (
            <a target="_blank" href={homeConfig?.data?.downloadUrl} rel="noreferrer">
              <ArrowDownCircleOutline className="text-2xl mr-4 " color="rgb(0, 186, 118)" />
            </a>
          )}
          <Link to="/languages">
            <img
              alt=""
              src={`/languages/${localeState.locale}.png`}
              className="w-6 h-6 rounded-full"
            />
          </Link>
        </div>
      </div>

      <div className="mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden h-[150px]">
        <Swiper autoplay loop>
          {homeConfig?.data?.banner?.map((v) => (
            <Swiper.Item key={v.bannerId} className=" ">
              <div className="h-[150px] flex flex-col">
                <img alt="" src={v.imageUrl} className="w-full h-full" />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      <div className="flex items-center justify-between mt-3 px-4 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden h-12">
        <img alt="" src={xiaolaba} className="w-5 h-5" />
        <Swiper
          direction="vertical"
          style={{ '--height': '3rem' }}
          loop
          autoplay
          indicator={() => null}
        >
          {homeCropMe?.data?.noticeList?.map((v) => (
            <Swiper.Item key={v.articleId}>
              <div className="flex items-center h-12 px-2">
                <span className="truncate">{v.title}</span>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
        <img alt="" src={lvjiantou} className="w-5 h-4" />
      </div>

      <div className="text-sm font-bold mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden h-28 px-2.5 flex items-center">
        {quotes.map((v, i) => (
          <Link
            to={{
              pathname: '/market',
              search: stringify({
                symbol: v.symbol,
              }),
            }}
            className="flex flex-col items-center w-1/3"
            key={i}
          >
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
          </Link>
        ))}
      </div>

      <div className="text-sm font-bold mt-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden py-2.5 px-2.5 flex items-stretch gap-1">
        <Link to="/subscribe" className="flex flex-col items-center  w-1/4">
          <img alt="" src={tab1_menu2} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666] break-all">
            {intl.formatMessage({ defaultMessage: '首發交易', id: 'QBilBJ' })}
          </div>
        </Link>
        <Link to="/pledge" className="flex flex-col items-center justify-start w-1/4">
          <img alt="" src={tab1_menu5} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666] break-all">
            {intl.formatMessage({ defaultMessage: '質押生息', id: 'R3Xfcn' })}
          </div>
        </Link>
        <Link to="/recharge-coin" className="flex flex-col items-center w-1/4">
          <img alt="" src={tab1_menu3} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666] break-all">
            {intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}
          </div>
        </Link>
        <a
          href="https://chatlink.mstatik.com/widget/standalone.html?eid=914b28b19ffc9b3dda4924057b2239a3"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center w-1/4"
        >
          <img alt="" src={tab1_menu4} className="w-9 h-9" />
          <div className="mt-2.5 text-xs text-[#666666] break-all">
            {intl.formatMessage({ defaultMessage: '綫上客服', id: 'wwOQz6' })}
          </div>
        </a>
      </div>

      <div className="text-sm font-bold my-3 shadow-md shadow-black/5 bg-white rounded-lg overflow-hidden flex items-center">
        <Tabs
          className="w-full"
          onChange={(key) => {
            setSortType(key);
          }}
        >
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '漲幅榜', id: 'ZH7DS8' })}
            key="1"
            className="text-[#A2A9BC]"
            destroyOnClose
          >
            <div className="flex items-center px-3">
              <div className="text-sm w-1/3">
                {intl.formatMessage({ defaultMessage: '名稱', id: 'ZU9FqB' })}
              </div>
              <div className="text-sm w-1/3 text-center">
                {intl.formatMessage({
                  id: 'iipjBw',
                  defaultMessage: '最新價',
                })}
              </div>
              <div className="text-sm w-1/3 text-right">
                {intl.formatMessage({
                  id: 'gA15gF',
                  defaultMessage: '漲跌幅',
                })}
              </div>
            </div>
            <Symbols quotes={marketData?.data?.quotes} />
          </Tabs.Tab>
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '跌幅榜', id: 'DsGgac' })}
            key="2"
            destroyOnClose
          >
            <div className="flex items-center px-3">
              <div className="text-sm w-1/3">
                {intl.formatMessage({
                  id: 'ZU9FqB',
                  defaultMessage: '名稱',
                })}
              </div>
              <div className="text-sm w-1/3 text-center">
                {intl.formatMessage({
                  id: 'iipjBw',
                  defaultMessage: '最新價',
                })}
              </div>
              <div className="text-sm w-1/3 text-right">
                {intl.formatMessage({
                  id: 'gA15gF',
                  defaultMessage: '漲跌幅',
                })}
              </div>
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
          <Link
            to={{
              pathname: '/market2',
              search: stringify({
                symbol: v.symbol,
              }),
            }}
            className="flex items-center"
          >
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
          </Link>
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
