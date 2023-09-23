import { animated, useSpring } from '@react-spring/web';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { switchColorValueAtom } from '../../atoms';
import { Quote } from '../../market/model';
import { getOriginSymbol, getUnitSymbol } from '../TransactionRecords/utils';

const HomeMarketItem = ({ data, sort }: { data: Quote; sort: number }) => {
  const [upDownColor] = useAtom(switchColorValueAtom);
  const unitSymbol = getUnitSymbol(data.symbol);

  const rate = Number(data.rate ?? 0);

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

  const intl = useIntl();

  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0.65, backgroundColor },
      to: { opacity: 0 },
      config: {
        duration: 500,
      },
    }),
    [],
  );

  const prevStateRef = useRef<number>();
  const startTimeoutRef = useRef<number>();
  const cancelTimeoutRef = useRef<number>();

  useEffect(() => {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
    }
    if (cancelTimeoutRef.current) {
      clearTimeout(cancelTimeoutRef.current);
    }

    if (prevStateRef.current != undefined || prevStateRef.current !== rate) {
      const duration = sort * 50;
      // @ts-ignore
      startTimeoutRef.current = setTimeout(() => {
        api.start({ opacity: 0.65, backgroundColor });
      }, duration);

      // @ts-ignore
      cancelTimeoutRef.current = setTimeout(() => {
        api.start({ opacity: 0 });
      }, duration + 500);
    }

    prevStateRef.current = rate;
  }, [api, backgroundColor, rate, sort]);

  return (
    <div className="text-[#666175ae] flex items-center justify-between text-center px-4 py-2 text-xs relative">
      <animated.div
        style={props}
        className=" absolute top-0 right-0 bottom-0 left-0"
      ></animated.div>
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
        <div>
          {intl.formatMessage({ defaultMessage: 'intl', id: 'Q9qgiz' })}
          {data.amount ?? '--'}
        </div>
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
