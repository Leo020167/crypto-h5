import { List } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AccountInfo } from '../../api/model';
import FinancialList from './FinancialList';
import PositionItem from './PositionItem';

interface HomeSpotAccountProps {
  account?: AccountInfo;
}
const HomeSpotAccount = ({ account }: HomeSpotAccountProps) => {
  const [selected, setSelected] = useState(0);

  const history = useHistory();
  return (
    <Container className="bg-gray-100">
      <div className="p-4 bg-white text-xs">
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">總資產(TFU)</div>
            <div>
              <span className="text-[#c1d3155] text-base">{account?.assets ?? '0'}</span>
              <span className="ml-1 text-gray-400">{account?.assetsCny ?? '≈HK$0.00'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-400">總盈虧(USDT)</div>
            <div>{account?.profit ?? '0'}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">可用(USDT)</div>
            <div>{account?.holdAmount ?? '0'}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">委託金額(USDT)</div>
            <div>{account?.frozenBail ?? '0'}</div>
          </div>
        </div>
      </div>

      <div className="mt-2.5 bg-white p-4">
        <div className="text-base text-gray-400 flex items-center">
          <span
            className={`px-4 ${selected === 0 ? ' text-black' : ''}`}
            onClick={() => setSelected(0)}
          >
            持倉
          </span>
          <span
            className={`px-4 ${selected === 1 ? ' text-black' : ''}`}
            onClick={() => setSelected(1)}
          >
            財務記錄
          </span>

          {selected === 1 && (
            <Link to="/take-coin-history" className="flex-1 text-right text-xs">
              全部
            </Link>
          )}
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
