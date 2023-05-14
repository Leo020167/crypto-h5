import currency from 'currency.js';
import { graphic } from 'echarts';
import { ECharts } from 'echarts/core';
import { last, max, min, orderBy, uniqBy } from 'lodash-es';
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
              markLine: {
                data: [
                  {
                    yAxis: last(priceData),
                  },
                ],
              },
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
            containLabel: true,
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 80,
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
            min: 'dataMin',
            max: 'dataMax',
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
              formatter: (v: number) => {
                return currency(v, { precision, separator: '', symbol: '' }).format();
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#28323e',
              },
            },
          },
        ],
        series: [
          {
            type: 'line',
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
            markLine: {
              symbol: 'none',
              data: [],
              label: {
                show: true,
                position: 'insideEndTop',
                color: '#f68e0e',
                fontSize: 8,
              },
            },
          },
        ],
      },
      true,
    );
  }, [precision]);

  return <div className="h-64" ref={ref}></div>;
};

export default MinuteDigitalTimeLineChart;
