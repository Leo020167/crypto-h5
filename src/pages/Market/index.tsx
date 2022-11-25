import { NavBar, Tabs } from 'antd-mobile';
import currency from 'currency.js';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useCoinInfo, useIsOptional } from '../../api/endpoints/transformer';
import { SwitchColorValueAtom } from '../../atoms';
import KLine, { Stock } from '../../components/KLine';
import { useKline, useQuoteReal } from '../../market/endpoints/marketWithTransformer';
import { QuoteReal } from '../../market/model';
import MinuteDetail from './MinuteDetail';

const IsLeverParam = withDefault(NumberParam, 1);

const Market = () => {
  const [symbol] = useQueryParam('symbol', StringParam);
  const [isLever] = useQueryParam('isLever', IsLeverParam);
  const [accountType] = useQueryParam('accountType', StringParam);

  const coinInfo = useCoinInfo(
    {
      symbol: symbol ?? '',
    },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const isOptional = useIsOptional(
    {
      symbol: symbol ?? '',
    },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const { data } = useKline({
    symbol: symbol ?? '',
    klineType: 'day',
    timestamp: '',
    type: 'v',
  });

  const stocks = useMemo(() => {
    const result: Stock[] = [];
    if (data?.data?.kline) {
      data?.data?.kline.split(';').forEach((v) => {
        // 1558713600,0.08163400,0.08278000,0.07951000,0.08131500,60550314.39726961;
        // 1日期,2开盘,3最高,4最低,5收盘(最近成交),成交量
        const d = v.split(',');
        if (d.length === 6) {
          result.push({
            date: Number(d[0]),
            open: Number(d[1]),
            highest: Number(d[2]),
            lowest: Number(d[3]),
            close: Number(d[4]),
            volume: Number(d[5]),
          });
        }
      });
    }

    return result;
  }, [data?.data?.kline]);

  const { data: quoteReal, refetch } = useQuoteReal(
    {
      symbol: symbol ?? '',
      depth: 30,
      klineType: 'min5',
    },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const coin = coinInfo.data?.data?.coin;

  const real = symbol ? (quoteReal?.data?.[symbol] as QuoteReal) : undefined;

  const price = currency(real?.last ?? '0.00', {
    separator: '',
    precision: real?.priceDecimals,
    symbol: '',
  });

  const [switchColorValue] = useAtom(SwitchColorValueAtom);

  const rate = Number(real?.rate ?? 0);

  const color = useMemo(() => {
    if (switchColorValue === '0') {
      if (rate > 0) return '#E2214E';
      else if (rate === 0 || rate === -100) return '#555555';
      return '#00AD88';
    } else {
      if (rate > 0) return '#00AD88';
      else if (rate === 0 || rate === -100) return '#555555';
      return '#E2214E';
    }
  }, [rate, switchColorValue]);

  useInterval(() => {
    refetch();
  }, 1000);

  return (
    <Container className="h-screen min-h-0 text-white flex flex-col">
      <NavBar>
        <div className="flex flex-col">
          <div className="text-lg font-bold">{coin?.name}</div>
          <span className="text-xs text-[#cbcbcb] leading-3">{symbol}</span>
        </div>
      </NavBar>
      <div className="flex-1 overflow-y-auto bg-[#131e31]">
        <div className="flex items-center justify-between px-4">
          <div>
            <div>
              <span className="text-4xl font-bold" style={{ color }}>
                {price.format()}
              </span>
              <span className="text-[#626073] ml-2">{real?.currency}</span>
            </div>

            <div className="mt-2 text-xs flex items-center gap-4">
              <span className="text-gray-400" style={{ color }}>
                {Number(real?.amt) >= 0 ? '+' : ''}
                {real?.amt ?? '0.00'}
              </span>
              <span className="text-gray-400" style={{ color }}>
                {Number(real?.rate) >= 0 ? '+' : ''}
                {real?.rate ?? '0'}%
              </span>
              {!!real?.openMarketStr && (
                <span className="bg-[#6175ae] rounded-sm px-1 py-0.5 scale-[0.85]">
                  {real.openMarketStr}
                </span>
              )}
            </div>
          </div>

          <div className="text-xs flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">高</span>
              <span className="text-white">{real?.high ?? '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">低</span>
              <span className="text-white">{real?.low ?? '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">量</span>
              <span className="text-white">{real?.amount ?? '0'}</span>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" stretch={false} className="px-1.5">
          <Tabs.Tab title="分時" key="1" />
          <Tabs.Tab title="5分鐘" key="2" />
          <Tabs.Tab title="15分鐘" key="3" />
          <Tabs.Tab title="1小時" key="4" />
          <Tabs.Tab title="日K" key="5" />
          <Tabs.Tab title="周K" key="6" />
        </Tabs>

        <KLine data={stocks} precision={real?.priceDecimals} />

        <Tabs defaultActiveKey="1" stretch={false} className="flex justify-center px-1.5">
          <Tabs.Tab title="交易" key="1" />
          <Tabs.Tab title="简介" key="2" />
        </Tabs>
        <MinuteDetail real={real} />
      </div>
      <div className="p-4 bg-[#131e31] flex items-center gap-2">
        <Link
          className="flex-1 bg-[#E2214E] h-10 flex items-center justify-center text-base"
          to={''}
        >
          看漲(做多)
        </Link>
        <Link
          className="flex-1 bg-[#00AD88] h-10 flex items-center justify-center text-base"
          to={''}
        >
          看跌(做空)
        </Link>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-nav-bar {
    border: 0;
    background-color: #131e31;
  }

  .adm-tabs {
    color: #626073;
    --adm-font-size-9: 14px;
    --adm-color-primary: #f08c42;

    .adm-tabs-header {
      border: 0;

      .adm-tabs-tab-wrapper {
        padding: 0 10px;
      }
    }
  }
`;

export default Market;
