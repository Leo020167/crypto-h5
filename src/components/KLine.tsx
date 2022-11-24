import { ECharts } from 'echarts/core';
import { useEffect, useRef } from 'react';
import myECharts from '../my-echarts';

import data from './stock-DJI.json';

const upColor = '#08a886';
const downColor = '#e1234d';

function calculateMA(dayCount: number, data: { values: number[][] }) {
  const result = [];
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

const KLine = () => {
  const ref = useRef<HTMLDivElement>(null);

  const myChartRef = useRef<ECharts>();

  useEffect(() => {
    if (ref.current) {
      myChartRef.current = myECharts.init(ref.current, {});
    }
  }, []);

  useEffect(() => {
    if (!myChartRef.current) return;

    myChartRef.current.setOption(
      {
        animation: false,
        visualMap: {
          show: false,
          seriesIndex: 4,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: downColor,
            },
            {
              value: -1,
              color: upColor,
            },
          ],
        },
        grid: [
          { top: 0, left: 0, right: 0, height: '40%', containLabel: true },
          {
            top: '50%',
            right: 0,
            left: 0,
            bottom: 0,
            height: '30%',
            containLabel: true,
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: data.categoryData,
            boundaryGap: true,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              show: false,
            },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax',
          },
          {
            type: 'category',
            gridIndex: 1,
            data: data.categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 'dataMin',
            max: 'dataMax',
          },
        ],
        yAxis: [
          {
            scale: true,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              show: false,
            },
          },
          {
            scale: true,
            gridIndex: 1,

            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              show: false,
            },
          },
          {
            axisLabel: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#222c38',
              },
            },
            data: [1, 2, 3],
          },
          {
            gridIndex: 1,
            axisLabel: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#222c38',
              },
            },
            data: [1, 2],
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 99,
            end: 100,
          },
        ],
        series: [
          {
            name: 'Dow-Jones index',
            type: 'candlestick',
            data: data.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: undefined,
              borderColor0: undefined,
            },
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5, data),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 0.5,
              color: '#357dad',
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, data),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 0.5,
              color: '#ffc43e',
            },
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, data),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 0.5,
              color: '#b080ce',
            },
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.volumes,
          },
        ],
      },
      true,
    );

    myChartRef.current.on('datazoom', (params: any) => {
      console.log(params);

      const start = params.batch[0].start;
      const end = params.batch[0].end;

      // TODO 計算值日期放到合適位置
      // 最大值向上，最小是向下

      console.log(end);
      console.log(data.categoryData.length);
      console.log((end * data.categoryData.length) / 100);
      console.log(Math.floor((end * data.categoryData.length) / 100));
      console.log(data.categoryData[Math.floor((end * data.categoryData.length) / 100)]);
    });

    return () => {
      // TODO
    };
  }, []);

  return <div className="h-96 bg-[#0F1826]" ref={ref}></div>;
};

export default KLine;
