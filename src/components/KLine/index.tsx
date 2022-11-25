import currency from 'currency.js';
import { ECharts } from 'echarts/core';
import { clamp, isNumber, last, orderBy } from 'lodash-es';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import myECharts from '../../my-echarts';
import { options } from './options';

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
      result.push('-');
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

const KLine = ({ data, precision = 2 }: { data: Stock[]; precision?: number }) => {
  const [ma5, setMA5] = useState<number | string>();
  const [ma10, setMA10] = useState<number | string>();
  const [ma30, setMA30] = useState<number | string>();
  const [vol, setVol] = useState<number | string>();
  const [vma5, setVMA5] = useState<number | string>();
  const [vma10, setVMA10] = useState<number | string>();

  const ref = useRef<HTMLDivElement>(null);

  const myChartRef = useRef<ECharts>();

  const maxRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const avgRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      myChartRef.current = myECharts.init(ref.current);
    }
  }, []);

  useEffect(() => {
    if (!myChartRef.current) return;
    myChartRef.current.setOption(options, true);
  }, []);

  useEffect(() => {
    const rawData = orderBy(data, (v) => v.date, ['asc']).map((v) => {
      const date = moment(v.date * 1000).format('YYYY-MM-DD');

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

      return [date, open, close, lowest, highest, volume];
    });

    const dates = rawData.map((v) => v[0]);
    const values = rawData.map(([, ...rest]) => rest as number[]);
    const volumes = values.map((v, i) => [i, v[4], v[0] > v[1] ? 1 : -1]);

    const ma5Data = calculateMA(5, values);
    const ma10Data = calculateMA(10, values);
    const ma30Data = calculateMA(30, values);
    const vma5Data = calculateMA(5, values, 4);
    const vma10Data = calculateMA(10, values, 4);

    myChartRef.current?.setOption({
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
    });

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
  }, [data, precision]);

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
