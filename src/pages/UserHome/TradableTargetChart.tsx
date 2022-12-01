import { useRef } from 'react';
import { UserRadar } from '../../api/model';
import useECharts from '../../hooks/useECharts';

const TradableTargetChart = ({ radar }: { radar?: UserRadar }) => {
  const ref = useRef<HTMLDivElement>(null);
  useECharts(ref, {
    grid: {
      containLabel: true,
    },
    radar: [
      {
        indicator: [
          { text: `跟單盈利額\n${radar?.radarFollowBalance}`, max: radar?.radarFollowBalance },
          { text: `人氣指數\n${radar?.radarFollowNum}`, max: radar?.radarFollowNum },
          { text: `跟單勝率\n${radar?.radarFollowWinRate}%`, max: 100 },
          { text: `跟單收益率\n${radar?.radarFollowProfitRate}%`, max: 100 },
          { text: `盈利能力\n${radar?.radarProfitRate}%`, max: 100 },
        ],
        radius: 80,
        center: ['50%', '60%'],
        axisName: {
          color: '#bebebe',
        },
      },
    ],
    series: [
      {
        type: 'radar',
        areaStyle: { opacity: 1 },
        data: [
          {
            value: [
              Number(radar?.radarFollowBalance) * 0.4,
              Number(radar?.radarFollowNum) * 0.4,
              Number(radar?.radarFollowWinRate) * 0.4,
              Number(radar?.radarFollowProfitRate) * 0.4,
              Number(radar?.radarProfitRate) * 0.4,
            ],
            name: 'Another Phone',
          },
        ],
        symbol: 'none',

        itemStyle: {
          color: '#9ca5c4',
        },
        lineStyle: {
          width: 1,
        },
      },
      {
        type: 'radar',
        areaStyle: { opacity: 0.6 },
        data: [
          {
            value: [
              Number(radar?.radarFollowBalance) * 0.6,
              Number(radar?.radarFollowNum) * 0.6,
              Number(radar?.radarFollowWinRate) * 0.6,
              Number(radar?.radarFollowProfitRate) * 0.6,
              Number(radar?.radarProfitRate) * 0.6,
            ],
            name: 'Another Phone',
          },
        ],
        symbol: 'none',

        itemStyle: {
          color: '#9ca5c4',
        },
        lineStyle: {
          width: 1,
        },
      },
      {
        type: 'radar',
        areaStyle: { opacity: 0.5 },
        data: [
          {
            value: [
              Number(radar?.radarFollowBalance) * 0.8,
              Number(radar?.radarFollowNum) * 0.8,
              Number(radar?.radarFollowWinRate) * 0.8,
              Number(radar?.radarFollowProfitRate) * 0.8,
              Number(radar?.radarProfitRate) * 0.8,
            ],
            name: 'Another Phone',
          },
        ],
        symbol: 'none',

        itemStyle: {
          color: '#9ca5c4',
        },
        lineStyle: {
          width: 1,
        },
      },
      {
        type: 'radar',
        areaStyle: { opacity: 0.4 },
        data: [
          {
            value: [
              Number(radar?.radarFollowBalance),
              Number(radar?.radarFollowNum),
              Number(radar?.radarFollowWinRate),
              Number(radar?.radarFollowProfitRate),
              Number(radar?.radarProfitRate),
            ],
            name: 'Another Phone',
          },
        ],
        symbol: 'none',
        itemStyle: {
          color: '#9ca5c4',
        },
        lineStyle: {
          width: 1,
        },
      },
    ],
  });
  return <div className=" h-60 bg-[#fafafa]" ref={ref}></div>;
};

export default TradableTargetChart;
