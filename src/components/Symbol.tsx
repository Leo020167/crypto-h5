import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Link, LinkProps } from 'react-router-dom';
import { switchColorValueAtom } from '../atoms';
import { getOriginSymbol, getUnitSymbol } from '../pages/TransactionRecords/utils';

interface SymbolProps {
  amount?: string;
  image?: string;
  linkProps: LinkProps;
  name?: string;
  price?: string;
  rate?: string;
  symbol?: string;
}
export const Symbol = ({ symbol, rate, amount, name, price, linkProps, image }: SymbolProps) => {
  const intl = useIntl();

  const switchColorValue = useAtomValue(switchColorValueAtom);
  const getColor = useCallback(
    (value: number) => {
      if (switchColorValue === '1') {
        return value < 0 ? '#EA3941' : '#00BA76';
      } else {
        return value < 0 ? '#00BA76' : '#EA3941';
      }
    },
    [switchColorValue],
  );

  return (
    <Link {...linkProps} className={`flex items-center gap-x-2.5 ${linkProps.className ?? ''}`}>
      <div className="flex w-1/2 items-center text-sm">
        <div className="mr-2.5 h-[38px] w-[38px]">
          <img src={image} alt="" className="h-full w-full object-contain" />
        </div>
        <div>
          <div className="flex items-baseline">
            <span className="text-base font-bold text-black dark:text-white">
              {symbol?.includes('/') ? getOriginSymbol(symbol) : symbol}
              {symbol?.includes('/') ? '/' + getUnitSymbol(symbol) : ''}
            </span>
            <div className="text-xs text-[#A2A9BC] dark:text-white">/{name}</div>
          </div>
          <div className="text-xs text-[#A2A9BC] dark:text-[#A2A9BC]">
            {intl.formatMessage({ defaultMessage: '量', id: 'pYPgzH' })} {amount}
          </div>
        </div>
      </div>

      <div className="w-1/4 text-center text-sm">
        <div className="text-base font-bold text-black dark:text-white">{price}</div>
      </div>

      <div className="flex w-[74px] flex-col items-end text-sm">
        <div
          className="flex h-8 w-full items-center  justify-center rounded-md bg-[#F32A44] text-base text-white"
          style={{ backgroundColor: getColor(rate?.includes('-') ? -1 : 1) }}
        >
          {rate}%
        </div>
      </div>
    </Link>
  );
};
