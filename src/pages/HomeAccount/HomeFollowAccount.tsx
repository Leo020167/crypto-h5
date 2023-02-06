import { Dialog } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useAllConfig } from '../../api/endpoints/transformer';
import { AccountInfo, FollowDv } from '../../api/model';
import ic_default_head from '../../assets/ic_default_head.png';
import ic_question_mark from '../../assets/ic_question_mark.png';
import useSwitchColor from '../../hooks/useSwitchColor';
import TradePositionList from './TradePositionList';

interface HomeFollowAccountProps {
  account?: AccountInfo;
  followDv?: FollowDv;
}
const HomeFollowAccount = ({ account, followDv }: HomeFollowAccountProps) => {
  const { data } = useAllConfig();

  const intl = useIntl();

  const getColor = useSwitchColor();

  const follow = useMemo(() => {
    if (followDv) {
      return (
        <div className="flex items-center bg-gray-100 px-4 py-2 mb-4 text-xs">
          <div className="flex-1 flex items-center">
            <span>{intl.formatMessage({ defaultMessage: '跟單機构：', id: 'yPig5i' })}</span>
            <img
              alt=""
              src={followDv.dvHeadUrl ?? ic_default_head}
              className="w-8 h-8 rounded-full ml-1"
            />
            <span className="ml-1">{followDv.dvUserName}</span>
          </div>

          <Link
            to={{ pathname: '/user-home', search: stringify({ userId: followDv.dvUid }) }}
            className="bg-white rounded-xl py-1 px-2"
          >
            {intl.formatMessage({ defaultMessage: '跟單機构', id: 'UX7lUm' })}
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center bg-gray-100 px-4 py-2 mb-4 text-sm">
        <div className="flex-1 flex items-center">
          <span>{intl.formatMessage({ defaultMessage: '跟單機构：', id: 'yPig5i' })}</span>
          <span>{intl.formatMessage({ defaultMessage: '未綁定', id: 'ReRVZ/' })}</span>
        </div>

        <Link to="/institution" className="bg-white rounded-xl py-1 px-2">
          {intl.formatMessage({ defaultMessage: '去綁定', id: '1cJMw5' })}
        </Link>
      </div>
    );
  }, [followDv, intl]);

  return (
    <div className="p-4 text-xs bg-white">
      {follow}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '總資產(USDT)', id: 'IbtpXH' })}
          </div>
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
            {intl.formatMessage({ defaultMessage: '未實現盈虧(USDT)', id: '7AsBpi' })}
          </div>
          <div style={{ color: getColor(account?.openBail) }}>{account?.openBail ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '跟單凍結資產', id: 'UBT8f1' })}
          </div>
          <div>{account?.disableAmount ?? '0'}</div>
        </div>
      </div>

      {!!account?.openList?.length && <TradePositionList data={account.openList} />}
    </div>
  );
};

export default HomeFollowAccount;
