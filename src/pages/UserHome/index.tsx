import { Button } from 'antd-mobile';
import { useRef } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { usePersonalHome } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';
import Screen from '../../components/Screen';
import useECharts from '../../hooks/useECharts';
import Capability from './Capability';

const UserHome = () => {
  const [userId] = useQueryParam('userId', StringParam);

  const ref = useRef<HTMLDivElement>(null);

  const { data } = usePersonalHome(
    { targetUid: userId ?? '' },
    {
      query: {
        enabled: !!userId,
      },
    },
  );

  const user = data?.data?.userRadar;

  useECharts(ref, {
    grid: {
      containLabel: true,
    },
    radar: [
      {
        indicator: [
          { text: 'Look', max: 100 },
          { text: 'Photo', max: 100 },
          { text: 'System', max: 100 },
          { text: 'Performance', max: 100 },
          { text: 'Screen', max: 100 },
        ],
        radius: 80,
        center: ['50%', '60%'],
      },
    ],
    series: [
      {
        type: 'radar',
        areaStyle: {},
        data: [
          {
            value: [95, 80, 95, 90, 91],
            name: 'Another Phone',
          },
        ],
      },
    ],
  });

  return (
    <Screen>
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="pt-5 flex flex-col items-center justify-center bg-white">
          <img alt="" src={user?.headUrl ?? ic_default_head} className="w-11 h-11 rounded-full" />
          <div className="mt-1 text-2xl font-bold text-[#1d3155]">{user?.userName}</div>
          <div className="text-gray-400">
            <span>ID: {user?.userId}</span>
            <span className="ml-5">--</span>
          </div>

          <div className="flex text-gray-400 mt-2 mb-5">
            <div className="flex flex-col items-center justify-center">
              <div className="text-[#1d3155] text-xl font-bold">--</div>
              <div className="text-gray-400 text-xs">訂閱數</div>
            </div>
            <div className="flex flex-col items-center justify-center ml-6">
              <div className="text-[#1d3155] text-xl font-bold">--</div>
              <div className="text-gray-400 text-xs">跟單人數</div>
            </div>
          </div>

          <div className="flex pb-5 px-5 w-full gap-5">
            <Button className="flex-1" color="primary">
              已訂閲
            </Button>
            <Button className="flex-1" color="primary">
              申請綁定
            </Button>
          </div>
        </div>

        <div className="mt-4 px-5 bg-white flex flex-col">
          <div className="text-[#1d3155] my-2.5">交易收益</div>

          <div className="flex">
            <div className="flex flex-col">
              <div className="text-xs text-gray-400">準確率</div>
              <div className="text-lg text-[#1d3155]">--</div>
            </div>
            <div className="flex flex-col flex-1 items-center">
              <div className="text-xs text-gray-400">總收益(USDT)</div>
              <div className="text-lg text-[#1d3155]">--</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400">上月收益(USDT)</div>
              <div className="text-lg text-[#1d3155]">--</div>
            </div>
          </div>

          <div className="text-[#1d3155] mt-2.5">交易收益</div>
          <div className="text-xs text-gray-400">全球期指，数字货币合约</div>

          <div className="my-4">
            <div className=" h-60 bg-[#fafafa]" ref={ref}></div>
          </div>
        </div>

        <Capability />
      </div>
    </Screen>
  );
};

export default UserHome;
