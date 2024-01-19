import { List } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AccountInfo } from '../../api/model';
import useSwitchColor from '../../hooks/useSwitchColor';
import FinancialList from './FinancialList';
import PositionItem from './PositionItem';

interface HomeSpotAccountProps {
  account?: AccountInfo;
}
const HomeSpotAccount = ({ account }: HomeSpotAccountProps) => {
  const [selected, setSelected] = useState(0);

  const intl = useIntl();

  const history = useHistory();

  const getColor = useSwitchColor();

  return (
    <Container>
      <div className="p-4 bg-white text-xs">
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '總資產(USDT)', id: 'IbtpXH' })}
            </div>
            <div>
              <span className="text-[#c1d3155] text-base">{account?.assets ?? '0'}</span>
              <span className="ml-1 text-gray-400">{account?.assetsCny ?? '≈HK$0.00'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '總盈虧(USDT)', id: '7xCHrU' })}
            </div>
            <div style={{ color: getColor(account?.profit) }}>
              {Number(account?.profit) >= 0 ? '+' : ''}
              {account?.profit ?? '0'}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '可用(USDT)', id: 'ntWvUZ' })}
            </div>
            <div>{account?.holdAmount ?? '0'}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '委託金額(USDT)', id: 'X/X8Ge' })}
            </div>
            <div>{account?.frozenBail ?? '0'}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 h-2.5"></div>
      <div className=" bg-white py-2.5">
        <div className="text-base text-gray-400 flex items-center">
          <span
            className={`px-4 ${selected === 0 ? ' text-black' : ''}`}
            onClick={() => setSelected(0)}
          >
            {intl.formatMessage({ defaultMessage: '持倉', id: 'k/qXgT' })}
          </span>
          <span
            className={`px-4 ${selected === 1 ? ' text-black' : ''}`}
            onClick={() => setSelected(1)}
          >
            {intl.formatMessage({ defaultMessage: '申购记录', id: 'jio6G3' })}
          </span>
        </div>
      </div>

      {selected === 0 ? (
        <List>
          {account?.openList?.map((v, i) => (
            <List.Item
              key={i}
              arrow={null}
              onClick={() =>
                history.push({
                  pathname: '/position-details',
                  search: stringify({ symbol: v.symbol }),
                })
              }
            >
              <PositionItem data={v} />
            </List.Item>
          ))}
        </List>
      ) : (
        <FinancialList />
      )}
    </Container>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 0;
  }
`;

export default HomeSpotAccount;
