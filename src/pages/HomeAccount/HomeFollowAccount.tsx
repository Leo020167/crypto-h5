import { Dialog } from 'antd-mobile';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllConfig } from '../../api/endpoints/transformer';
import { AccountInfo } from '../../api/model';
import ic_default_head from '../../assets/ic_default_head.png';
import ic_question_mark from '../../assets/ic_question_mark.png';

interface HomeFollowAccountProps {
  account?: AccountInfo;
  followDv?: any;
}
const HomeFollowAccount = ({ account, followDv }: HomeFollowAccountProps) => {
  const { data } = useAllConfig();

  const follow = useMemo(() => {
    if (followDv) {
      return <img alt="" src={ic_default_head} className="w-8 h-8 rounded-full" />;
    }

    return (
      <div className="flex items-center bg-gray-100 px-4 py-2 mb-4 text-sm">
        <div className="flex-1 flex items-center">
          <span>跟單機构:</span>
          <span>未綁定</span>
        </div>

        <Link to="/institution" className="bg-white rounded-xl py-1 px-2">
          去綁定
        </Link>
      </div>
    );
  }, [followDv]);

  return (
    <div className="p-4 text-xs bg-white">
      {follow}
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
                confirmText: '知道了',
              });
            }}
          >
            <span>風險率</span>
            <img alt="" src={ic_question_mark} className="w-3.5 h-3.5 ml-1 -mt-[2px]" />
          </a>
          <div>{account?.riskRate}%</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
        <div>
          <div className="text-gray-400">可用保證金(USDT)</div>
          <div>{account?.eableBail ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">未實現盈虧(USDT)</div>
          <div>
            {Number(account?.profit) >= 0 ? '+' : ''}
            {account?.profit ?? '0'}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
        <div>
          <div className="text-gray-400">持倉保證金(USDT)</div>
          <div>{account?.openBail ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">跟單凍結資產</div>
          <div>{account?.disableAmount ?? '0'}</div>
        </div>
      </div>
    </div>
  );
};

export default HomeFollowAccount;
