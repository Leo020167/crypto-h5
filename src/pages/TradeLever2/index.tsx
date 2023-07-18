import { Dialog, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { stringify } from 'query-string';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import {
  useHomeAccount,
  useProOrderCancel,
  useProOrderConfig,
} from '../../api/endpoints/transformer';
import ic_switch_sell_selected from '../../assets/ic_switch_buy_selected.9.png';
import ic_switch_sell_unselected from '../../assets/ic_switch_buy_unselected.9.png';
import ic_switch_buy_selected from '../../assets/ic_switch_sell_selected.9.png';
import ic_switch_buy_unselected from '../../assets/ic_switch_sell_unselected.9.png';

import Screen from '../../components/Screen';
import { useQuoteReal } from '../../market/endpoints/marketWithTransformer';
import { CurrencyListPopup } from './CurrencySelectionPopup';
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

  const { data: proOrderQueryList, refetch } = useHomeAccount();

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

  const history = useHistory();
  const [visible, setVisible] = useState(false);

  return (
    <Container>
      <Screen
        className="content"
        navBarProps={{
          left: (
            <div className="flex items-center" onClick={() => setVisible(true)}>
              {symbol}
              <DownFill fontSize={12} className="ml-2" />
            </div>
          ),
        }}
      >
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="flex gap-4 bg-white px-2 py-4">
            <div className="w-3/5">
              <div className="mb-2 flex items-center">
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

          <div className="mt-4 bg-white p-4">
            <div className="flex items-center">
              <div className="item-center flex flex-1 gap-5 text-lg font-bold text-[#6175ae]">
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
                className="flex items-center text-xs font-bold text-gray-400"
              >
                {intl.formatMessage({ defaultMessage: '全部', id: 'dGBGbt' })}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {selected === '0' ? (
              <TradeCurrentOpenPosition data={proOrderQueryList?.data?.spotAccount?.openList} />
            ) : (
              <TradeCurrentCommission
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

        <CurrencyListPopup
          symbol={symbol ?? ''}
          visible={visible}
          onClose={() => setVisible(false)}
          onSelect={(item) => {
            setVisible(false);
            history.replace({
              pathname: '/trade-lever2',
              search: stringify({ buySell: 1, symbol: item.symbol }),
            });
          }}
        />
      </Screen>
    </Container>
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

const Container = styled.div`
  .content {
    height: calc(100vh - 84px);
  }
`;

export default TradeLever;
