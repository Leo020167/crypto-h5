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
        <div className="mb-4 flex items-center bg-gray-100 px-4 py-2 text-xs">
          <div className="flex flex-1 items-center">
            <span>{intl.formatMessage({ defaultMessage: '跟單機构：', id: 'yPig5i' })}</span>
            <img
              alt=""
              src={followDv.dvHeadUrl ?? ic_default_head}
              className="ml-1 h-8 w-8 rounded-full"
            />
            <span className="ml-1">{followDv.dvUserName}</span>
          </div>

          <Link
            to={{ pathname: '/user-home', search: stringify({ userId: followDv.dvUid }) }}
            className="rounded-xl bg-white px-2 py-1"
          >
            {intl.formatMessage({ defaultMessage: '跟單機构', id: 'UX7lUm' })}
          </Link>
        </div>
      );
    }

    return (
      <div className="mb-4 flex items-center bg-gray-100 px-4 py-2 text-sm">
        <div className="flex flex-1 items-center">
          <span>{intl.formatMessage({ defaultMessage: '跟單機构：', id: 'yPig5i' })}</span>
          <span>{intl.formatMessage({ defaultMessage: '未綁定', id: 'ReRVZ/' })}</span>
        </div>

        <Link to="/institution" className="rounded-xl bg-white px-2 py-1">
          {intl.formatMessage({ defaultMessage: '去綁定', id: '1cJMw5' })}
        </Link>
      </div>
    );
  }, [followDv, intl]);

  return (
    <div className="bg-white p-4 text-xs">
      {follow}
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
          <div style={{ color: getColor(account?.profit) }}>
            {Number(account?.profit) >= 0 ? '+' : ''}
            {account?.profit ?? '0'}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
        <div>
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '持倉保證金', id: 'KyHiY3' })}
          </div>
          <div>{account?.openBail ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '跟單凍結資產', id: 'UBT8f1' })}
          </div>
          <div>{account?.disableAmount ?? '0'}</div>
        </div>
      </div>

      {/* {!!account?.openList?.length && <TradePositionList data={account.openList} />} */}
    </div>
  );
};

export default HomeFollowAccount;
