import { Button } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import { usePersonalHome } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';
import { userAtom } from '../../atoms';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';
import Capability from './Capability';
import TradableTargetChart from './TradableTargetChart';

const UserHome = () => {
  const [userId] = useQueryParam('userId', StringParam);

  const { data } = usePersonalHome(
    { targetUid: userId ?? '' },
    {
      query: {
        enabled: !!userId,
      },
    },
  );

  const radar = data?.data?.userRadar;

  const currentUser = useAtomValue(userAtom);

  const buttons = useMemo(() => {
    if (radar?.userId === currentUser?.userId) return null;

    const renderFollowLabel = () => {
      if (radar?.myIsAttention === '0') {
        if (radar.subIsFee === '0') {
          return '免費訂閱';
        }
        return '訂閱';
      } else {
        if (radar?.subIsFee === '0') {
          return '已訂閱';
        } else {
          return '續費';
        }
      }
    };

    const renderTime = () => {
      if (radar?.myIsAttention !== '0' && radar?.subIsFee !== '0') {
        if (radar?.isExpireTime === '1' && Number(radar.expireTime) > 0) {
          return <div style={{ color: 'red' }}>訂閱已過期</div>;
        } else if (radar?.isExpireTime === '0' && Number(radar.expireTime) > 0) {
          return (
            <div style={{ color: '#1d3155' }}>
              到期: {stringDateFormat(radar.expireTime, 'YYYY-MM-DD')}
            </div>
          );
        }
      }
      return null;
    };

    return (
      <div className="flex pb-5 px-5 w-full gap-5">
        <div className="flex-1">
          <Button color="primary" block>
            {renderFollowLabel()}
          </Button>
          {renderTime()}
        </div>

        <div className="flex-1">
          <Button color="primary" block>
            申請綁定
          </Button>
        </div>
      </div>
    );
  }, [currentUser?.userId, radar]);

  return (
    <Screen>
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="pt-5 flex flex-col items-center justify-center bg-white">
          <img alt="" src={radar?.headUrl ?? ic_default_head} className="w-11 h-11 rounded-full" />
          <div className="mt-1 text-2xl font-bold text-[#1d3155]">{radar?.userName}</div>
          <div className="text-gray-400">
            <span>ID: {radar?.userId}</span>
            <span className="ml-5">已入駐{radar?.days ?? '--'}天</span>
          </div>

          <div className="flex text-gray-400 mt-2 mb-5">
            <div className="flex flex-col items-center justify-center">
              <div className="text-[#1d3155] text-xl font-bold">{radar?.attentionNum ?? '--'}</div>
              <div className="text-gray-400 text-xs">訂閱數</div>
            </div>
            <div className="flex flex-col items-center justify-center ml-6">
              <div className="text-[#1d3155] text-xl font-bold">
                {radar?.radarFollowNum ?? '--'}
              </div>
              <div className="text-gray-400 text-xs">跟單人數</div>
            </div>
          </div>

          {buttons}
        </div>

        <div className="mt-4 px-5 bg-white flex flex-col">
          <div className="text-[#1d3155] my-2.5">交易收益</div>

          <div className="flex">
            <div className="flex flex-col">
              <div className="text-xs text-gray-400">準確率</div>
              <div className="text-lg text-[#1d3155]">{radar?.correctRate ?? '--'}%</div>
            </div>
            <div className="flex flex-col flex-1 items-center">
              <div className="text-xs text-gray-400">總收益(USDT)</div>
              <div className="text-lg text-[#1d3155]">{radar?.totalProfit ?? '--'}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400">上月收益(USDT)</div>
              <div className="text-lg text-[#1d3155]">{radar?.monthProfit ?? '--'}</div>
            </div>
          </div>

          <div className="text-[#1d3155] mt-2.5">可交易標的</div>
          <div className="text-xs text-gray-400 mt-1">{radar?.describes}</div>

          <div className="my-4 relative">
            <TradableTargetChart radar={radar} />
            <Link
              to={{ pathname: '/radar-summary', search: stringify({ userId }) }}
              className="absolute right-2 bottom-2 text-xs text-[#fb875a] z-10"
            >
              詳情 &gt;
            </Link>
          </div>
        </div>

        <Capability />

        {!!radar?.recommend && (
          <div className="mt-5 mb-12 px-4 text-sm text-[#3d3a50]">{radar?.recommend}</div>
        )}
      </div>
    </Screen>
  );
};

export default UserHome;
