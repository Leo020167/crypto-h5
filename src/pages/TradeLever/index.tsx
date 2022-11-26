import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import ic_switch_sell_selected from '../../assets/ic_switch_buy_selected.9.png';
import ic_switch_sell_unselected from '../../assets/ic_switch_buy_unselected.9.png';
import ic_switch_buy_selected from '../../assets/ic_switch_sell_selected.9.png';
import ic_switch_buy_unselected from '../../assets/ic_switch_sell_unselected.9.png';

import Screen from '../../components/Screen';

const BuySellParam = withDefault(NumberParam, 1);

const TradeLever = () => {
  const [symbol] = useQueryParam('symbol', StringParam);
  const [buySell, setBuySell] = useQueryParam('buySell', BuySellParam);

  return (
    <Screen headerTitle="HSI">
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          <div className="w-3/5 flex items-center">
            <SelectorSwitchBuy
              isSelected={buySell === 1}
              className="ml-4"
              onClick={() => setBuySell(1)}
            >
              看漲
            </SelectorSwitchBuy>
            <SelectorSwitchSell isSelected={buySell === -1} onClick={() => setBuySell(-1)}>
              看跌
            </SelectorSwitchSell>
          </div>
          <div className="w-2/5"></div>
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
