import { Dialog } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useAllConfig } from '../../api/endpoints/transformer';
import { AccountInfo } from '../../api/model';
import ic_question_mark from '../../assets/ic_question_mark.png';
import useSwitchColor from '../../hooks/useSwitchColor';
import TradePositionList from './TradePositionList';

interface HomeDigitalAccountProps {
  account?: AccountInfo;
}
const HomeDigitalAccount = ({ account }: HomeDigitalAccountProps) => {
  const { data } = useAllConfig();

  const intl = useIntl();

  const getColor = useSwitchColor();

  return (
    <div>
      <div className="p-4 text-xs bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400">總資產(USDT)</div>
            <div className="mt-1">
              <span className="text-[#c1d3155] text-base">{account?.assets ?? '0'}</span>
              <span className="ml-1">{account?.assetsCny ?? '≈HK$0.00'}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <a
              className="text-gray-400 flex items-center justify-center"
              onClick={() => {
                Dialog.alert({
                  content: data?.data?.riskRateDesc,
                  confirmText: intl.formatMessage({ defaultMessage: '知道了', id: 'r1IImU' }),
                });
              }}
            >
              <span>{intl.formatMessage({ defaultMessage: '風險率', id: '7iWsp4' })}</span>
              <img alt="" src={ic_question_mark} className="w-3.5 h-3.5 ml-1 -mt-[2px]" />
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
            <div style={{ color: getColor(account?.profit) }}>
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
      </div>

      {!!account?.openList?.length && <TradePositionList data={account.openList} />}
    </div>
  );
};

export default HomeDigitalAccount;
