import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { SwitchColorValueAtom } from '../../atoms';
import { Quote } from '../../market/model';
import { getOriginSymbol, getUnitSymbol } from '../TransactionRecords/utils';

const HomeMarketItem = ({ data }: { data: Quote }) => {
  const [upDownColor] = useAtom(SwitchColorValueAtom);
  const unitSymbol = getUnitSymbol(data.symbol);

  const rate = Number(data.rate);

  const backgroundColor = useMemo(() => {
    if (upDownColor === '0') {
      if (rate > 0) return '#E2214E';
      else if (rate === 0 || rate === -100) return '#555555';
      return '#00AD88';
    } else {
      if (rate > 0) return '#00AD88';
      else if (rate === 0 || rate === -100) return '#555555';
      return '#E2214E';
    }
  }, [rate, upDownColor]);

  const ratePrefix = rate >= 0 ? '+' : '';

  return (
    <div className="text-[#666175ae] flex items-center justify-between text-center h-10 px-4 text-xs">
      <div className="min-w-[100px] flex flex-col text-left">
        <div className="text-base font-bold text-[#1d3155]">
          {getOriginSymbol(data.symbol)}
          {data.symbol?.includes('/') && (
            <span className="text-[#666175ae] ml-1 text-xs">{unitSymbol}</span>
          )}
        </div>
        <div>{data.name}</div>
      </div>
      <div className="flex-1">
        <div className="text-base font-bold text-[#1d3155]">{data.price}</div>
        <div>量{data.amount ?? '--'}</div>
      </div>
      <div className="min-w-[80px] text-sm text-white">
        <div
          className="rounded flex items-center justify-center bg-black h-8"
          style={{ backgroundColor }}
        >
          {ratePrefix + data.rate}%
        </div>
      </div>
    </div>
  );
};

export default HomeMarketItem;
