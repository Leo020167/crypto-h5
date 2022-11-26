import currency from 'currency.js';
import { graphic } from 'echarts';
import { ECharts } from 'echarts/core';
import { max, min, orderBy, uniqBy } from 'lodash-es';
import moment from 'moment';
import { useCallback, useEffect, useRef } from 'react';
import { useGetMinuteLine } from '../../market/endpoints/marketWithTransformer';
import myECharts from '../../my-echarts';

interface MinuteDigitalTimeLineChartProps {
  symbol?: string | null;
  precision?: number;
}

const MinuteDigitalTimeLineChart = ({ symbol, precision }: MinuteDigitalTimeLineChartProps) => {
  useGetMinuteLine(
    {
      symbol: symbol ?? '',
      timestamp: 0,
      pageSize: 0,
    },
    {
      query: {
        enabled: !!symbol,
        onSuccess(data) {
          if (Number(data.code) === 200) {
            parserData(data);
          }
        },
      },
    },
  );

  const ref = useRef<HTMLDivElement>(null);

  const myChartRef = useRef<ECharts>();

  const parserData = useCallback(
    (data: any) => {
      if (data?.data?.['min_' + symbol]) {
        const content: string = data.data['min_' + symbol];
        // 1669452960,12.9351,0.000000; 时间1,当前价2,成交量3
        const result = content
          .split(';')
          .map((v) => v.split(','))
          .map((v) => ({
            time: moment(Number(v[0]) * 1000).format('YYYY-MM-DD HH:mm'),
            price: Number(v[1]),
            vol: Number(v[2]),
          }));

        const list = uniqBy(orderBy(result, ['time'], ['asc']), (v) => v.time);

        const priceData = list.map((v) => v.price);
        const volumes = list.map((v) => v.vol);

        const maxPrice = max(priceData) ?? 0;
        const minPrice = min(priceData) ?? 0;

        myChartRef.current?.setOption({
          xAxis: [
            {
              data: list.map((v) => v.time),
            },
            {
              data: list.map((v) => v.time),
            },
          ],
          yAxis: [
            {
              min: min(priceData),
              max: max(priceData),
              interval: (maxPrice - minPrice) / 4,
            },
          ],
          series: [
            {
              data: priceData,
            },
            {
              data: volumes,
            },
          ],
        });
      }
    },
    [symbol],
  );

  useEffect(() => {
    if (ref.current) {
      myChartRef.current = myECharts.init(ref.current);
    }

    return () => {
      myChartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!myChartRef.current) return;
    myChartRef.current.setOption(
      {
        grid: [
          {
            top: '5%',
            left: 0,
            right: 0,
            bottom: '10%',
            height: '70%',
            containLabel: true,
          },
          {
            top: '80%',
            left: 0,
            right: 0,
            bottom: 0,
            height: '20%',
            containLabel: true,
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 90,
            end: 100,
          },
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#28323e',
              },
            },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: [],
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#28323e',
              },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              color: '#fff',
              fontSize: 8,
              formatter: (v: string) => moment(v, 'YYYY-MM-DD HH:mm').format('HH:mm'),
              width: 100,
              padding: [0, 20],
            },
            splitNumber: 5,
          },
        ],
        yAxis: [
          {
            position: 'right',
            type: 'value',
            axisLabel: {
              show: true,
              inside: true,
              color: '#fff',
              fontSize: 8,
              margin: 2,
              formatter: (v: number) => {
                return currency(v, { precision, separator: '', symbol: '' }).format();
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          {
            position: 'left',
            boundaryGap: false,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              show: true,
              inside: true,
              color: '#fff',
              fontSize: 8,
              margin: 2,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#28323e',
              },
            },
            data: ['', 2, 3, 4, 5],
          },
        ],
        series: [
          {
            type: 'line',
            step: 'start',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: '#f68e0e',
            },
            lineStyle: {
              width: 0.5,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(246, 142, 14, .5)',
                },
                {
                  offset: 1,
                  color: 'rgba(246, 142, 14, 0)',
                },
              ]),
            },
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [],
            itemStyle: {
              color: '#f68e0e',
            },
          },
          {
            type: 'effectScatter',
            data: [['Sun', 210]],
            rippleEffect: {
              number: 1,
              period: 2,
              scale: 2.5,
            },
            markLine: {
              symbol: 'none',
              data: [
                [
                  {
                    name: '233322',
                    coord: ['Sun', 210],
                  },
                  {
                    coord: ['222', 210],
                  },
                ],
              ],
            },
          },
        ],
      },
      true,
    );
  }, [precision]);

  return (
    <div className="h-96" ref={ref}>
      MinuteDigitalTimeLineChart
    </div>
  );
};

export default MinuteDigitalTimeLineChart;
