import { List, SearchBar, Swiper, Tabs } from 'antd-mobile';
import { ArrowDownCircleOutline } from 'antd-mobile-icons';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useHomeConfig } from '../../api/endpoints/transformer';

import { darkModeAtom, localeStateAtom, switchColorValueAtom } from '../../atoms';
import { DarkModeSwitch } from '../../components';
import { Symbol } from '../../components/Symbol';
import { useChatLink } from '../../hooks/useChatLink';
import { useMarketData, useQuoteHomePage } from '../../market/endpoints/marketWithTransformer';
import { Quote } from '../../market/model';

const Home = () => {
  const localeState = useAtomValue(localeStateAtom);

  const mode = useAtomValue(darkModeAtom);
  const { data: homeConfig } = useHomeConfig({
    domain: location.hostname.substring(location.hostname.indexOf('.') + 1),
  });

  const { data: quoteHomePage } = useQuoteHomePage();

  const [sortType, setSortType] = useState<string>('1');
  const { data: marketData } = useMarketData(
    {
      sortField: 'rate',
      sortType: sortType,
      tab: 'stock',
    },
    {
      query: {
        keepPreviousData: true,
      },
    },
  );

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

  const chatLink = useChatLink();

  const history = useHistory();

  const symbolsHeader = useMemo(() => {
    return (
      <div className="flex h-10 items-center gap-x-2.5 px-2.5 dark:bg-[#3D424E] dark:text-[#A2A9BC]">
        <div className="w-1/2 text-sm">
          {intl.formatMessage({
            id: 'ZU9FqB',
            defaultMessage: '名稱',
          })}
        </div>
        <div className="w-1/4 text-center text-sm">
          {intl.formatMessage({
            id: 'iipjBw',
            defaultMessage: '最新價',
          })}
        </div>
        <div className="w-1/4 text-right text-sm">
          {intl.formatMessage({
            id: 'gA15gF',
            defaultMessage: '漲跌幅',
          })}
        </div>
      </div>
    );
  }, [intl]);

  return (
    <Container className="flex-1 overflow-y-auto bg-[#E3E6F1] px-4 dark:bg-[#161720]">
      <div className="mt-4 flex items-center ">
        <div className="mr-4 flex flex-1">
          <SearchBar
            className="w-full"
            placeholder={intl.formatMessage({ defaultMessage: '输入币种名称搜索', id: 'LaUwF3' })}
            onFocus={() => {
              history.push('/search-coin');
            }}
          />
        </div>

        <div className="mr-4 flex items-center">
          {!!import.meta.env.VITE_ALLOW_DOWNLOAD && homeConfig?.data?.downloadUrl && (
            <a target="_blank" href={homeConfig?.data?.downloadUrl} rel="noreferrer">
              <ArrowDownCircleOutline className="mr-4 text-2xl " color="rgb(0, 186, 118)" />
            </a>
          )}
          <Link to="/languages">
            <img
              alt=""
              src={`/languages/${localeState.locale}.png`}
              className="h-6 w-6 rounded-full"
            />
          </Link>
        </div>

        <div className="">
          <DarkModeSwitch />
        </div>
      </div>

      <div className="mt-4 h-[160px] overflow-hidden rounded-lg bg-white shadow-md shadow-black/5 dark:bg-[#2A2E38]">
        <Swiper autoplay loop>
          {homeConfig?.data?.banner?.map((v) => (
            <Swiper.Item key={v.bannerId} className=" ">
              <div className="flex h-[160px] flex-col">
                <img alt="" src={v.imageUrl} className="h-full w-full" />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      <div className="mt-4 flex h-28 items-center overflow-hidden rounded-lg bg-white px-2.5 text-sm font-bold shadow-md shadow-black/5 dark:bg-[#2A2E38]">
        {quotes.map((v, i) => (
          <Link
            to={{
              pathname: '/market2',
              search: stringify({
                symbol: v.symbol,
              }),
            }}
            className="flex w-1/3 flex-col items-center"
            key={i}
          >
            <div className="flex items-center text-sm font-bold text-black dark:text-white">
              <img src={v.image} alt="" className="mr-1 h-4 w-4 object-contain" />
              <div>{[v.symbol, v.currency].filter(Boolean).join('/')}</div>
            </div>
            <div
              className="mt-2 text-sm text-[#EA3941]"
              style={{ color: getColor(v.rate?.includes('-') ? -1 : 1) }}
            >
              {v.rate}%
            </div>
            <div
              className="mt-1 text-base leading-4 text-[#EA3941]"
              style={{ color: getColor(v.rate?.includes('-') ? -1 : 1) }}
            >
              {v.price}
            </div>
            <div className="mt-2 text-xs text-[#888888]">{v.priceCny}</div>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 rounded-lg bg-white py-4 font-bold shadow-md shadow-black/5 dark:bg-[#2A2E38]">
        <Link to="/subscribe" className="flex flex-col items-center">
          <img
            alt=""
            src={new URL(`../../assets/${mode}/tab1_menu1.png`, import.meta.url).toString()}
            className="h-9 w-9"
          />
          <div className="mt-2.5 break-all text-xs text-[#666666] dark:text-white">
            {intl.formatMessage({ defaultMessage: '首發交易', id: 'QBilBJ' })}
          </div>
        </Link>
        <Link to="/pledge" className="flex flex-col items-center justify-start">
          <img
            alt=""
            src={new URL(`../../assets/${mode}/tab1_menu5.png`, import.meta.url).toString()}
            className="h-9 w-9"
          />
          <div className="mt-2.5 break-all text-xs text-[#666666] dark:text-white">
            {intl.formatMessage({ defaultMessage: '質押生息', id: 'R3Xfcn' })}
          </div>
        </Link>
        <Link to="/recharge-coin" className="flex flex-col items-center">
          <img
            alt=""
            src={new URL(`../../assets/${mode}/tab1_menu3.png`, import.meta.url).toString()}
            className="h-9 w-9"
          />
          <div className="mt-2.5 break-all text-xs text-[#666666] dark:text-white">
            {intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}
          </div>
        </Link>
        <a href={chatLink} target="_blank" rel="noreferrer" className="flex flex-col items-center">
          <img
            alt=""
            src={new URL(`../../assets/${mode}/tab1_menu4.png`, import.meta.url).toString()}
            className="h-9 w-9"
          />
          <div className="mt-2.5 break-all text-xs text-[#666666] dark:text-white">
            {intl.formatMessage({ defaultMessage: '綫上客服', id: 'wwOQz6' })}
          </div>
        </a>
      </div>

      <div className="my-4 flex items-center overflow-hidden rounded-lg bg-white text-sm font-bold shadow-md shadow-black/5 dark:bg-[#2A2E38]">
        <Tabs
          className="home-tabs w-full pt-1"
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
            {symbolsHeader}
            <div className="px-2.5">
              <Symbols quotes={marketData?.data?.quotes} />
            </div>
          </Tabs.Tab>
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '跌幅榜', id: 'DsGgac' })}
            key="2"
            destroyOnClose
          >
            {symbolsHeader}
            <div className="px-2.5">
              <Symbols quotes={marketData?.data?.quotes} />
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </Container>
  );
};

const Symbols = ({ quotes = [] }: { quotes?: Quote[] }) => {
  return (
    <List>
      {quotes?.map((item, i) => (
        <List.Item key={i}>
          <Symbol
            {...item}
            linkProps={{
              to: {
                pathname: '/market2',
                search: stringify({
                  symbol: item.symbol,
                }),
              },
            }}
          />
        </List.Item>
      ))}
    </List>
  );
};

const Container = styled.div`
  .adm-tabs {
    --title-font-size: 16px;
    --active-line-height: 0;
    --active-line-color: transparent;
    --active-title-color: #000;
    color: #999999;

    .adm-tabs-header {
      border: 0;
      width: 70%;
      margin: 0 auto;
    }

    .adm-tabs-tab {
      font-weight: 400;
    }

    .adm-tabs-tab-active {
      font-weight: bold;
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
  .adm-tabs-content {
    padding: 0;
  }
  .adm-list {
    --padding-left: 0px;
    --padding-right: 0px;

    .adm-list-item-content {
      border: 0;
    }
    .adm-list-item-content-main {
      padding: 10px 0;
    }
  }
`;

export default Home;
