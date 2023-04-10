import { Dialog } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useAllConfig } from '../../api/endpoints/transformer';
import { AccountInfo } from '../../api/model';
import ic_question_mark from '../../assets/ic_question_mark.png';
import TradePositionList from './TradePositionList';

interface HomeStockAccountProps {
  account?: AccountInfo;
}
const HomeStockAccount = ({ account }: HomeStockAccountProps) => {
  const { data } = useAllConfig();
  const intl = useIntl();
  return (
    <div className="bg-white p-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '總資產(USDT)', id: 'IbtpXH' })}
          </div>
          <div className="mt-1">
            <span className="text-base text-[#c1d3155]">{account?.assets ?? '0'}</span>
            <span className="ml-1">{account?.assetsCny ?? '≈HK$0.00'}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <a
            className="flex items-center justify-center text-gray-400"
            onClick={() => {
              Dialog.alert({
                content: data?.data?.riskRateDesc,
                confirmText: intl.formatMessage({ defaultMessage: '知道了', id: 'r1IImU' }),
              });
            }}
          >
            <span>{intl.formatMessage({ defaultMessage: '風險率', id: '7iWsp4' })}</span>
            <img alt="" src={ic_question_mark} className="-mt-[2px] ml-1 h-3.5 w-3.5" />
          </a>
          <div>{account?.riskRate}%</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
        <div>
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '可用保證金(USDT)', id: 'ebj6E6' })}
          </div>
          <div>{account?.eableBail ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '未實現盈虧(USDT)', id: '7AsBpi' })}
          </div>
          <div>
            {Number(account?.profit) >= 0 ? '+' : ''}
            {account?.profit ?? '0'}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
        <div>
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '持倉保證金(USDT)', id: 'xPkCfU' })}
          </div>
          <div>{account?.openBail ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '凍結保證金', id: 'x9w/Fu' })}
          </div>
          <div>{account?.disableAmount ?? '0'}</div>
        </div>
      </div>

      {!!account?.openList?.length && <TradePositionList data={account.openList} />}
    </div>
  );
};

export default HomeStockAccount;
