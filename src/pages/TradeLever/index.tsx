import { stringify } from 'query-string';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useProOrderConfig, useProOrderQueryList } from '../../api/endpoints/transformer';
import ic_arrow from '../../assets/ic_arrow.png';
import ic_switch_sell_selected from '../../assets/ic_switch_buy_selected.9.png';
import ic_switch_sell_unselected from '../../assets/ic_switch_buy_unselected.9.png';
import ic_switch_buy_selected from '../../assets/ic_switch_sell_selected.9.png';
import ic_switch_buy_unselected from '../../assets/ic_switch_sell_unselected.9.png';

import Screen from '../../components/Screen';
import useSwitchColor from '../../hooks/useSwitchColor';
import { useQuoteReal } from '../../market/endpoints/marketWithTransformer';
import TradeLeverDetails from './TradeLeverDetails';
import TradeLeverPrices from './TradeLeverPrices';

const BuySellParam = withDefault(NumberParam, 1);

const TradeLever = () => {
  const [symbol] = useQueryParam('symbol', StringParam);
  const [buySell, setBuySell] = useQueryParam('buySell', BuySellParam);

  const { data } = useQuoteReal(
    {
      symbol: symbol ?? '',
    },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const quote = data?.data?.[symbol ?? ''];

  const { data: orderConfig } = useProOrderConfig(
    { symbol: symbol ?? '' },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const [selected, setSelected] = useState<number>(0);
  const { data: proOrderQueryList } = useProOrderQueryList(
    {
      symbol: '',
      accountType: orderConfig?.data?.accountType,
      buySell: '',
      pageNo: '1',
      orderState: '',
      isDone: selected === 0 ? '1' : '0',
    },
    {
      query: {
        enabled: !!orderConfig?.data?.accountType,
      },
    },
  );

  const getColor = useSwitchColor();

  return (
    <Screen headerTitle="HSI">
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="flex bg-white p-4 gap-4">
          <div className="w-3/5">
            <div className="flex items-center mb-2">
              <SelectorSwitchBuy
                isSelected={buySell === 1}
                onClick={() => setBuySell(1, 'replaceIn')}
              >
                看漲
              </SelectorSwitchBuy>
              <SelectorSwitchSell
                isSelected={buySell === -1}
                onClick={() => setBuySell(-1, 'replaceIn')}
              >
                看跌
              </SelectorSwitchSell>
            </div>
            <TradeLeverDetails
              symbol={symbol}
              buySell={buySell}
              quote={quote}
              config={orderConfig?.data}
            />
          </div>

          <div className="w-2/5">
            <TradeLeverPrices data={quote} />
          </div>
        </div>

        <div className="p-4 bg-white mt-4">
          <div className="flex items-center">
            <div className="flex item-center text-lg text-[#6175ae] gap-5 font-bold flex-1">
              <a
                className={`flex items-center ${selected !== 0 ? 'text-sm text-gray-400' : ''}`}
                onClick={() => setSelected(0)}
              >
                當前開倉
              </a>
              <a
                className={`flex items-center ${selected !== 1 ? 'text-sm text-gray-400' : ''}`}
                onClick={() => setSelected(1)}
              >
                當前委托
              </a>
            </div>

            <Link
              to={{
                pathname: '/transaction-records',
                search: stringify({ accountType: orderConfig?.data?.accountType }),
              }}
              className="flex items-center text-gray-400 text-xs font-bold"
            >
              全部
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {proOrderQueryList?.data?.data?.length ? (
            proOrderQueryList?.data?.data?.map((v, i) => (
              <Link
                to={{
                  pathname: '/lever-info',
                  search: stringify({
                    orderId: v.orderId,
                  }),
                }}
                key={i}
                className="p-4 bg-white"
              >
                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
                    <span className="text-xs text-gray-400 ml-2 flex-1">{v.buySellValue}</span>
                  </div>
                  <img alt="" src={ic_arrow} className="h-4" />
                </div>
                <div className="flex mt-2.5">
                  <div className="flex flex-col w-1/3">
                    <span className="text-xs text-gray-400">手數</span>
                    <span className="text-sm text-[#3d3a50]">{v.openHand}</span>
                  </div>
                  <div className="flex flex-col w-1/3 items-center">
                    <span className="text-xs text-gray-400">開倉價</span>
                    <span className="text-sm text-[#3d3a50]">{v.openPrice}</span>
                  </div>
                  <div className="flex flex-col w-1/3 items-end">
                    <span className="text-xs text-gray-400">盈虧(USDT)</span>
                    <span className="text-sm text-[#3d3a50]" style={{ color: getColor(v.profit) }}>
                      {Number(v.profit) >= 0 ? '+' : ''}
                      {v.profit}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <span className="text-center p-10">暫無數據</span>
          )}
        </div>
      </div>
    </Screen>
  );
};

const SelectorSwitchBuy = styled.div<{ isSelected?: boolean }>`
  flex: 1;
  height: 36px;
  background-size: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-repeat: no-repeat;
  color: ${(props) => (props.isSelected ? '#fff' : '#BEBEBE')};
  background-image: ${(props) =>
    props.isSelected ? `url(${ic_switch_buy_selected})` : `url(${ic_switch_buy_unselected})`};
`;

const SelectorSwitchSell = styled.div<{ isSelected?: boolean }>`
  flex: 1;
  height: 36px;
  background-size: cover;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-repeat: no-repeat;
  color: ${(props) => (props.isSelected ? '#fff' : '#BEBEBE')};
  background-image: ${(props) =>
    props.isSelected ? `url(${ic_switch_sell_selected})` : `url(${ic_switch_sell_unselected})`};
`;

export default TradeLever;
