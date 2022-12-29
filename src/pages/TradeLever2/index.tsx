import { Dialog, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import {
  useProOrderCancel,
  useProOrderConfig,
  useProOrderQueryList,
} from '../../api/endpoints/transformer';
import ic_switch_sell_selected from '../../assets/ic_switch_buy_selected.9.png';
import ic_switch_sell_unselected from '../../assets/ic_switch_buy_unselected.9.png';
import ic_switch_buy_selected from '../../assets/ic_switch_sell_selected.9.png';
import ic_switch_buy_unselected from '../../assets/ic_switch_sell_unselected.9.png';

import Screen from '../../components/Screen';
import { useQuoteReal } from '../../market/endpoints/marketWithTransformer';
import TradeCurrentCommission from './TradeCurrentCommission';
import TradeCurrentOpenPosition from './TradeCurrentOpenPosition';
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
    { symbol: symbol ?? '', type: '2' },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const [selected, setSelected] = useState<string>('0');
  const { data: proOrderQueryList, refetch } = useProOrderQueryList(
    {
      symbol: '',
      accountType: orderConfig?.data?.accountType,
      buySell: '',
      pageNo: '1',
      orderState: selected === '0' ? '1' : '0',
      isDone: selected,
      type: '2',
    },
    {
      query: {
        enabled: !!orderConfig?.data?.accountType,
      },
    },
  );

  useInterval(() => {
    refetch();
  }, 2000);

  const proOrderCancel = useProOrderCancel({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  const intl = useIntl();

  return (
    <Screen headerTitle={symbol}>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="flex bg-white p-4 gap-4">
          <div className="w-3/5">
            <div className="flex items-center mb-2">
              <SelectorSwitchBuy
                isSelected={buySell === 1}
                onClick={() => setBuySell(1, 'replaceIn')}
              >
                {intl.formatMessage({ defaultMessage: '買入', id: 'sY5/oP' })}
              </SelectorSwitchBuy>
              <SelectorSwitchSell
                isSelected={buySell === -1}
                onClick={() => setBuySell(-1, 'replaceIn')}
              >
                {intl.formatMessage({ defaultMessage: '賣出', id: 'EOWvn9' })}
              </SelectorSwitchSell>
            </div>
            <TradeLeverDetails
              symbol={symbol}
              buySell={buySell}
              quote={quote}
              config={orderConfig?.data}
              onCreateOrderSuccess={() => {
                refetch();
              }}
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
                className={`flex items-center ${selected !== '0' ? 'text-sm text-gray-400' : ''}`}
                onClick={() => setSelected('0')}
              >
                {intl.formatMessage({ defaultMessage: '當前開倉', id: 'KyuHZw' })}
              </a>
              <a
                className={`flex items-center ${selected !== '1' ? 'text-sm text-gray-400' : ''}`}
                onClick={() => setSelected('1')}
              >
                {intl.formatMessage({ defaultMessage: '當前委托', id: 'Mj7nsK' })}
              </a>
            </div>

            <Link
              to={{
                pathname: '/transaction-records',
                search: stringify({ accountType: orderConfig?.data?.accountType }),
              }}
              className="flex items-center text-gray-400 text-xs font-bold"
            >
              {intl.formatMessage({ defaultMessage: '全部', id: 'dGBGbt' })}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {selected === '0' ? (
            <TradeCurrentOpenPosition data={proOrderQueryList?.data?.data} />
          ) : (
            <TradeCurrentCommission
              data={proOrderQueryList?.data?.data}
              onCancel={(orderId) => {
                Dialog.confirm({
                  content: intl.formatMessage({ defaultMessage: '確定撤銷訂單', id: 'UXkrvR' }),
                  confirmText: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
                  onConfirm() {
                    proOrderCancel.mutate({
                      data: {
                        orderId,
                        type: '2',
                      },
                    });
                  },
                });
              }}
            />
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
