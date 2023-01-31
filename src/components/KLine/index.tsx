import currency from 'currency.js';

import { scaleLinear } from 'd3-scale';
import { ECharts } from 'echarts/core';
import { useAtomValue } from 'jotai';
import { clamp, isNumber, last, orderBy } from 'lodash-es';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { switchColorValueAtom } from '../../atoms';
import useSwitchColor from '../../hooks/useSwitchColor';
import { kline } from '../../market/endpoints/marketWithTransformer';
import myECharts from '../../my-echarts';

const scale = scaleLinear().domain([0, 250, 350]).range([0, 70, 85]);

export interface Stock {
  date: number;
  open: number;
  close: number;
  lowest: number;
  highest: number;
  volume: number;
}

function calculateMA(dayCount: number, values: number[][], cursor = 1) {
  const result = [];
  for (let i = 0, len = values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += values[i - j][cursor];
    }
    result.push(+(sum / dayCount));
  }
  return result;
}

const getIndex = (rate: number, items: any[], calculator = Math.floor) => {
  const index = calculator((rate * items.length) / 100);
  return clamp(index, 0, items.length - 1);
};

const getValue = (rate: number, items: any[], calculator = Math.floor) => {
  return items[getIndex(rate, items, calculator)];
};

const KLine = ({
  symbol,
  klineType,
  precision = 2,
}: {
  symbol?: string | null;
  klineType: string;
  precision?: number;
}) => {
  const [ma5, setMA5] = useState<number | string>();
  const [ma10, setMA10] = useState<number | string>();
  const [ma30, setMA30] = useState<number | string>();
  const [vol, setVol] = useState<number | string>();
  const [vma5, setVMA5] = useState<number | string>();
  const [vma10, setVMA10] = useState<number | string>();

  const ref = useRef<HTMLDivElement>(null);

  const switchColorValue = useAtomValue(switchColorValueAtom);
  const { upColor, downColor } = useMemo(() => {
    if (switchColorValue === '1') {
      return { upColor: '#08a886', downColor: '#e1234d' };
    }
    return { upColor: '#e1234d', downColor: '#08a886' };
  }, [switchColorValue]);

  const myChartRef = useRef<ECharts>();

  const maxRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const avgRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const switchColor = useSwitchColor();

  const rawDataRef = useRef<
    {
      date: string;
      open: number;
      close: number;
      lowest: number;
      highest: number;
      volume: number;
      rate: number;
      amt: number;
    }[]
  >([]);

  const setOptions = useCallback(() => {
    const dates = rawDataRef.current.map((v) => v.date);
    const values = rawDataRef.current.map((v) => [v.open, v.close, v.lowest, v.highest, v.volume]);
    const volumes = values.map((v, i) => [i, v[4], v[0] > v[1] ? 1 : -1]);

    const ma5Data = calculateMA(5, values);
    const ma10Data = calculateMA(10, values);
    const ma30Data = calculateMA(30, values);
    const vma5Data = calculateMA(5, values, 4);
    const vma10Data = calculateMA(10, values, 4);

    myChartRef.current?.setOption(
      {
        dataZoom: [
          {
            start: scale(rawDataRef.current.length),
            end: 100,
          },
        ],
        xAxis: [
          {
            data: dates,
          },
          {
            data: dates,
          },
        ],
        series: [
          {
            data: values,
          },
          {
            data: ma5Data,
          },
          {
            data: ma10Data,
          },
          {
            data: ma30Data,
          },
          {
            data: volumes,
          },
          {
            data: vma5Data,
          },
          {
            data: vma10Data,
          },
        ],
      },
      false,
    );

    myChartRef.current?.on('datazoom', (params: any) => {
      const start = params.batch[0].start;
      const end = params.batch[0].end;
      setDates(start, end);
      setValues(start, end);
    });

    setMA5(last(ma5Data));
    setMA10(last(ma10Data));
    setMA30(last(ma30Data));

    setVol(last(values)?.[4] || '');
    setVMA5(last(vma5Data));
    setVMA10(last(vma10Data));

    const setValues = (start = 85, end = 100) => {
      const startIndex = getIndex(start, values);
      const endIndex = getIndex(end, values);

      const array = values.slice(startIndex, endIndex + 1);

      let max = 0;
      let min = 0;

      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        max = element[3];
        min = element[2];

        const index = startIndex + i;

        if (isNumber(ma5Data[index]) && ma5Data[index] > 0) {
          max = Math.max(max, ma5Data[index] as number);
          min = Math.min(min, ma5Data[index] as number);
        }

        if (isNumber(ma10Data[index]) && ma10Data[index] > 0) {
          max = Math.max(max, ma10Data[index] as number);
          min = Math.min(min, ma10Data[index] as number);
        }

        if (isNumber(ma30Data[index]) && ma30Data[index] > 0) {
          max = Math.max(max, ma30Data[index] as number);
          min = Math.min(min, ma30Data[index] as number);
        }
      }

      const avg = (max + min) / 2;
      if (maxRef.current) {
        maxRef.current.innerHTML = max.toFixed(precision);
      }
      if (minRef.current) {
        minRef.current.innerHTML = min.toFixed(precision);
      }
      if (avgRef.current) {
        avgRef.current.innerHTML = avg.toFixed(precision);
      }
    };

    const setDates = (start = 85, end = 100) => {
      if (startDateRef.current) {
        const val = getValue(start, dates);
        startDateRef.current.innerHTML = val;
      }
      if (endDateRef.current) {
        const val = getValue(end, dates, Math.round);
        endDateRef.current.innerHTML = val;
      }
    };

    setValues();
    setDates();
  }, [precision]);

  const refetch = useCallback(() => {
    kline({ symbol: symbol ?? '', klineType: klineType, timestamp: '', type: 'v' }).then((data) => {
      if (Number(data.code) === 200) {
        const result: Stock[] = [];
        data?.data?.kline?.split(';').map((v) => {
          // 1558713600,0.08163400,0.08278000,0.07951000,0.08131500,60550314.39726961;
          // 1日期,2开盘,3最高,4最低,5收盘(最近成交),成交量
          const d = v.split(',');
          if (d.length === 6) {
            result.push({
              date: Number(d[0]),
              open: Number(d[1]),
              highest: Number(d[2]),
              lowest: Number(d[3]),
              close: Number(d[4]),
              volume: Number(d[5]),
            });
          }
        });

        const stocks = result;

        const rawData = orderBy(stocks, (v) => v.date, ['asc']).map((v, index) => {
          const format = ['day', 'week'].includes(klineType) ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
          const date = moment(v.date * 1000).format(format);

          let open = v.open;
          const close = v.close;
          let lowest = v.lowest;
          let highest = v.highest;
          const volume = v.volume;

          if (v.close > 0 && v.open <= 0) {
            open = v.close;
            lowest = v.close;
            highest = v.close;
          }

          const result = { date, open, close, lowest, highest, volume, rate: 0, amt: 0 };
          if (index > 0) {
            let amt = close - stocks[index - 1].close;
            let rate = (amt * 100) / stocks[index - 1].close;
            if (rate <= -100) {
              rate = 0;
              amt = 0;
            }

            result.rate = rate;
            result.amt = amt;
          }
          return result;
        });

        rawDataRef.current = rawData;

        setOptions();
      }
    });
  }, [klineType, setOptions, symbol]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (ref.current) {
      myChartRef.current = myECharts.init(ref.current);
    }

    return () => {
      myChartRef.current?.dispose();
    };
  }, []);

  const intl = useIntl();

  const date = intl.formatMessage({
    defaultMessage: '日期',
    id: 'gQ4+K1',
  });
  const open = intl.formatMessage({
    defaultMessage: '開',
    id: 'LBC7Kf',
  });
  const highest = intl.formatMessage({
    defaultMessage: '高',
    id: 'hBkLmp',
  });
  const lowest = intl.formatMessage({
    defaultMessage: '低',
    id: '5kTIPB',
  });
  const close = intl.formatMessage({
    defaultMessage: '收',
    id: 'gTNZNZ',
  });
  const amt = intl.formatMessage({
    defaultMessage: '漲跌額',
    id: 'kckDfZ',
  });
  const rate = intl.formatMessage({
    defaultMessage: '漲跌幅',
    id: 'gA15gF',
  });
  const volume = intl.formatMessage({
    defaultMessage: '成交量',
    id: 'uC1tZ7',
  });

  useEffect(() => {
    if (!myChartRef.current) return;

    myChartRef.current.setOption(
      {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          borderWidth: 1,
          borderColor: 'rgb(34, 43, 58)',
          padding: 10,
          textStyle: {
            color: '#fff',
            fontSize: 12,
            width: 100,
          },

          backgroundColor: 'rgb(18, 27, 42, 0.8)',
          position: function (pos: any, params: any, el: any, elRect: any, size: any) {
            const obj: any = {
              top: 10,
            };
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
          },
          formatter(params: any) {
            const item = rawDataRef.current[params[0].dataIndex];
            const FMT = (value: string | number) =>
              currency(value, {
                separator: '',
                symbol: '',
                precision,
              });

            const color = switchColor(item.rate);

            return [
              `<div class="flex justify-between">${date}<span class="ml-2">${params[0].axisValue}</span></div>`,
              `<div class="flex justify-between">${open}<span class="ml-2">${FMT(
                item.open,
              ).format()}</span></div>`,
              `<div class="flex justify-between">${highest}<span class="ml-2">${FMT(
                item.highest,
              ).format()}</span></div>`,
              `<div class="flex justify-between">${lowest}<span class="ml-2">${FMT(
                item.lowest,
              ).format()}</span></div>`,
              `<div class="flex justify-between">${close}<span class="ml-2">${FMT(
                item.close,
              ).format()}</span></div>`,
              `<div class="flex justify-between">${amt}<span class="ml-2" style="color: ${color}">${FMT(
                amt,
              ).format()}</span></div>`,
              `<div class="flex justify-between">${rate}<span class="ml-2" style="color: ${color}">${item.rate.toFixed(
                2,
              )}%</span></div>`,
              `<div class="flex justify-between">${volume}<span class="ml-2">${item.volume}</span></div>`,
            ].join('');
          },
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all',
            },
          ],
          label: {
            backgroundColor: '#777',
          },
        },
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
          { top: 0, left: 0, right: 0, height: '60%' },
          {
            top: '70%',
            right: 0,
            left: 0,
            bottom: 0,
            height: '30%',
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: [],
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
            data: [],
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
              show: true,
              lineStyle: {
                color: '#222c38',
              },
            },
          },
          {
            scale: true,
            gridIndex: 1,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#222c38',
              },
            },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: rawDataRef.current.length < 150 ? 15 : 86,
            end: 100,
          },
        ],
        series: [
          {
            name: 'Dow-Jones index',
            type: 'candlestick',
            data: [],
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
            data: [],
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
            data: [],
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
            data: [],
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
            data: [],
          },
          {
            name: 'VMA5',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 0.5,
              color: '#357dad',
            },
          },
          {
            name: 'VMA10',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 0.5,
              color: '#ffc43e',
            },
          },
        ],
      },
      false,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intl, precision]);

  return (
    <div>
      <div className="px-4 py-1 bg-[#0F1826] flex text-xs gap-3">
        <span className=" text-[#357dad]">
          MA5: {currency(ma5 ?? '0').format({ precision, symbol: '', separator: '' })}
        </span>
        <span className=" text-[#ffc43e]">
          MA10: {currency(ma10 ?? '0').format({ precision, symbol: '', separator: '' })}
        </span>
        <span className="text-[#b080ce]">
          MA30: {currency(ma30 ?? '0').format({ precision, symbol: '', separator: '' })}
        </span>
      </div>

      <div className="relative">
        <div className="h-96 bg-[#0F1826]" ref={ref}></div>
        <span className="absolute left-0 top-0 z-10 text-[#e1234d]" ref={maxRef}>
          --
        </span>
        <span className="absolute left-0 top-[104px] z-10 text-gray-400" ref={avgRef}>
          --
        </span>
        <span className="absolute left-0 top-[216px] z-10 text-[#01aa87]" ref={minRef}>
          --
        </span>

        <div className="absolute z-10 top-[234px] text-xs w-full">
          <div className="flex items-center gap-1">
            <span className="text-[#01aa87]">
              VOL: {currency(vol ?? 0, { precision }).format({ separator: '', symbol: '' })}
            </span>
            <span className="text-[#357dad]">
              MA5: {currency(vma5 ?? 0, { precision }).format({ separator: '', symbol: '' })}
            </span>
            <span className="text-[#ffc43e]">
              MA10: {currency(vma10 ?? 0, { precision }).format({ separator: '', symbol: '' })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#357dad]" ref={startDateRef}>
              --
            </span>
            <span className="text-[#357dad]" ref={endDateRef}>
              --
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KLine;
