import { NavBar, Tabs } from 'antd-mobile';
import currency from 'currency.js';
import { useAtom, useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useCoinInfo } from '../../api/endpoints/transformer';
import { marketPeriodAtom, refreshRateAtom, switchColorValueAtom } from '../../atoms';
import KLine from '../../components/KLine';
import { useQuoteReal } from '../../market/endpoints/marketWithTransformer';
import { QuoteReal } from '../../market/model';
import { useAuthStore } from '../../stores/auth';

import DealList from './DealList';
import MinuteDetail from './MinuteDetail';
import MinuteDigitalTimeLineChart from './MinuteDigitalTimeLineChart';

const IsLeverParam = withDefault(NumberParam, 1);

const Market = () => {
  const [symbol] = useQueryParam('symbol', StringParam);
  const [isLever] = useQueryParam('isLever', IsLeverParam);

  const [marketPeriod, setMarketPeriod] = useAtom(marketPeriodAtom);

  const { userInfo } = useAuthStore();

  const { data: coinInfo } = useCoinInfo(
    {
      symbol: symbol ?? '',
    },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

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

  const refreshRate = useAtomValue(refreshRateAtom);
  useInterval(
    () => {
      refetch();
    },
    refreshRate * 1000 || 2000,
  );

  const coin = coinInfo?.data?.coin;

  const real = symbol ? (quoteReal?.data?.[symbol] as QuoteReal) : undefined;

  const price = currency(real?.last ?? '0.00', {
    separator: '',
    precision: real?.priceDecimals,
    symbol: '',
  });

  const [switchColorValue] = useAtom(switchColorValueAtom);

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

  const history = useHistory();

  const handleBuySell = useCallback(
    (buySell: number) => {
      if (userInfo) {
        if (isLever === 0) {
          history.push({
            pathname: '/trade',
            search: stringify({
              symbol,
              buySell,
            }),
          });
        } else {
          history.push({
            pathname: '/trade-lever2',
            search: stringify({
              symbol,
              buySell,
            }),
          });
        }
      } else {
        history.push('/login');
      }
    },
    [history, isLever, symbol, userInfo],
  );

  const intl = useIntl();

  return (
    <Container className="flex h-screen min-h-0 flex-col text-white">
      <NavBar onBack={() => history.goBack()}>
        <div className="flex flex-col">
          <div className="text-lg font-bold">{coin?.name}</div>
          <span className="text-xs leading-3 text-[#cbcbcb]">{symbol}</span>
        </div>
      </NavBar>
      <div className="flex-1 overflow-y-auto bg-[#131e31] pb-20">
        <div className="flex items-center justify-between px-4">
          <div>
            <div>
              <span className="text-4xl font-bold" style={{ color }}>
                {price.format()}
              </span>
              <span className="ml-2 text-[#626073]">{real?.currency}</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="text-gray-400" style={{ color }}>
                {Number(real?.amt) >= 0 ? '+' : ''}
                {real?.amt ?? '0.00'}
              </span>
              <span className="text-gray-400" style={{ color }}>
                {Number(real?.rate) >= 0 ? '+' : ''}
                {real?.rate ?? '0'}%
              </span>
              {!!real?.openMarketStr && (
                <span className="scale-[0.85] rounded-sm bg-[#6175ae] px-1 py-0.5">
                  {real.openMarketStr}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">
                {intl.formatMessage({ defaultMessage: '高', id: 'hBkLmp' })}
              </span>
              <span className="text-white">{real?.high ?? '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">
                {intl.formatMessage({ defaultMessage: '低', id: '5kTIPB' })}
              </span>
              <span className="text-white">{real?.low ?? '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">
                {intl.formatMessage({ defaultMessage: '量', id: 'pYPgzH' })}
              </span>
              <span className="text-white">{real?.amount ?? '0'}</span>
            </div>
          </div>
        </div>
        <Tabs
          stretch={false}
          activeKey={marketPeriod}
          onChange={setMarketPeriod}
          className="px-1.5"
        >
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '分時', id: 'S3V2J5' })}
            key="min1"
          />
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '5分鐘', id: 'pPa5HI' })}
            key="min5"
          />
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '15分鐘', id: 'KSTxH2' })}
            key="min15"
          />
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '1小時', id: 'IAX0f0' })}
            key="hour1"
          />
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '日K', id: 'CarZOU' })} key="day" />
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '周K', id: 'oV1YAL' })}
            key="week"
          />
        </Tabs>

        {marketPeriod === 'min1' ? (
          <MinuteDigitalTimeLineChart key="min1" symbol={symbol} precision={real?.priceDecimals} />
        ) : (
          <KLine
            key="kline"
            symbol={symbol}
            klineType={marketPeriod}
            precision={real?.priceDecimals}
          />
        )}

        <Tabs
          defaultActiveKey="1"
          stretch={false}
          className="flex flex-col items-center justify-center px-1.5"
        >
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '深度', id: 'zR07Wc' })} key="1">
            <MinuteDetail real={real} />
          </Tabs.Tab>
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '交易', id: '/ErIar' })} key="2">
            <DealList real={real} />
          </Tabs.Tab>
        </Tabs>
      </div>
      <div className="fixed bottom-0 z-10 flex w-full items-center bg-[#131e31] p-4">
        <a
          className={`flex h-10 flex-1 items-center justify-center bg-[${
            switchColorValue === '1' ? '#00AD88' : '#E2214E'
          }] text-base`}
          onClick={() => handleBuySell(1)}
        >
          {intl.formatMessage({ defaultMessage: '買入', id: 'sY5/oP' })}
        </a>
        <a
          className={`ml-2 flex h-10 flex-1 items-center justify-center bg-[${
            switchColorValue === '0' ? '#00AD88' : '#E2214E'
          }] text-base`}
          onClick={() => handleBuySell(-1)}
        >
          {intl.formatMessage({ defaultMessage: '賣出', id: 'EOWvn9' })}
        </a>
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
    --adm-font-size-9: 14px;
    --adm-color-primary: #f08c42;
    --content-padding: 0;
    color: #626073;
    .adm-tabs-header {
      border: 0;

      .adm-tabs-tab-wrapper {
        padding: 0 10px;
      }
    }

    .adm-tabs-content {
      width: 100%;
    }
  }
`;

export default Market;
