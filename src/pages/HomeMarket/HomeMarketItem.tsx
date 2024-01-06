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
      startTimeoutRef.current = setTimeout(() => {
        api.start({ opacity: 0.65, backgroundColor });
      }, duration);

      cancelTimeoutRef.current = setTimeout(() => {
        api.start({ opacity: 0 });
      }, duration + 500);
    }

    prevStateRef.current = rate;
  }, [api, backgroundColor, rate, sort]);

  return (
    <div className="relative flex items-center justify-between px-4 py-2 text-center text-xs text-[#666175ae] ">
      <animated.div
        style={props}
        className=" absolute bottom-0 left-0 right-0 top-0"
      ></animated.div>
      <div className="flex min-w-[100px] items-center text-left">
        <img src={data.image} alt="" className="mr-2.5 h-[38px] w-[38px] object-contain" />
        <div>
          <div className="text-base font-bold text-[#1d3155] dark:text-white">
            {getOriginSymbol(data.symbol)}
            {data.symbol?.includes('/') && (
              <span className="ml-1 text-xs text-[#666175ae]">{unitSymbol}</span>
            )}
          </div>
          <div className="dark:text-[#B2BAD4]">{data.name}</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-base font-bold text-[#1d3155] dark:text-white">{data.price}</div>
        <div className="dark:text-[#B2BAD4]">
          {intl.formatMessage({ defaultMessage: '量', id: 'pYPgzH' })} {data.amount ?? '--'}
        </div>
      </div>
      <div className="min-w-[80px] text-sm text-white">
        <div
          className="flex h-8 items-center justify-center rounded bg-black"
          style={{ backgroundColor }}
        >
          {ratePrefix + data.rate}%
        </div>
      </div>
    </div>
  );
};

export default HomeMarketItem;
