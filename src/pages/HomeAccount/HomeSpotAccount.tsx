import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { AccountInfo } from '../../api/model';
import FinancialList from './FinancialList';
import { PositionList } from './PositionList';

interface HomeSpotAccountProps {
  account?: AccountInfo;
}
const HomeSpotAccount = ({ account }: HomeSpotAccountProps) => {
  const [selected, setSelected] = useState(0);

  const intl = useIntl();

  return (
    <div className="bg-gray-100 dark:bg-[#161720]">
      <div className="bg-white p-4 text-xs dark:bg-[#2A2E38]">
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '總資產(USDT)', id: 'IbtpXH' })}
            </div>
            <div>
              <span className="text-base text-[#c1d3155]">{account?.assets ?? '0'}</span>
              <span className="ml-1 text-gray-400">{account?.assetsCny ?? '≈HK$0.00'}</span>
            </div>
          </div>
          {/* <div className="flex flex-col items-end">
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '總盈虧(USDT)', id: '7xCHrU' })}
            </div>
            <div>{account?.profit ?? '0'}</div>
          </div> */}
        </div>

        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '可用(USDT)', id: 'ntWvUZ' })}
            </div>
            <div>{account?.holdAmount ?? '0'}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '凍結金額(USDT)', id: 'xRwyQV' })}
            </div>
            <div>{account?.frozenAmount ?? '0'}</div>
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
      <div className="mt-2.5 bg-white p-4 dark:bg-[#2A2E38]">
        <div className="flex items-center text-base text-gray-400">
          <span
            className={`px-4 ${selected === 0 ? ' text-black dark:text-white' : ''}`}
            onClick={() => setSelected(0)}
          >
            {intl.formatMessage({ defaultMessage: '持倉', id: 'k/qXgT' })}
          </span>
          <span
            className={`px-4 ${selected === 1 ? ' text-black dark:text-white' : ''}`}
            onClick={() => setSelected(1)}
          >
            {intl.formatMessage({ defaultMessage: '財務記錄', id: 'gtC59I' })}
          </span>

          {selected === 1 && (
            <Link to="/take-coin-history" className="flex-1 text-right text-xs">
              {intl.formatMessage({ defaultMessage: '全部', id: 'dGBGbt' })}
            </Link>
          )}
        </div>
      </div>
      {selected === 0 ? <PositionList account={account} /> : <FinancialList />}
    </div>
  );
};

export default HomeSpotAccount;
