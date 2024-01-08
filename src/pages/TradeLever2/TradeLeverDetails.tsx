import { Input, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import Select, { StylesConfig } from 'react-select';
import styled from 'styled-components';
import {
  useHomeAccount,
  useProOrderCheckOut,
  useProOrderCheckOutUsdt,
  useProOrderOpen,
} from '../../api/endpoints/transformer';
import { ProOrderConfigResponseAllOfData } from '../../api/model';
import { darkModeAtom } from '../../atoms';
import { QuoteReal } from '../../market/model';

interface TradeLeverDetailsProps {
  config?: ProOrderConfigResponseAllOfData;
  symbol?: string | null;
  buySell?: number;
  quote?: QuoteReal;
  onCreateOrderSuccess?: () => void;
}

const TradeLeverDetails = ({
  symbol,
  buySell,
  quote,
  config,
  onCreateOrderSuccess,
}: TradeLeverDetailsProps) => {
  const intl = useIntl();
  const orderTypeOptions = useMemo(
    () => [
      { value: 'market', label: intl.formatMessage({ defaultMessage: '市價委托', id: 'NQroRs' }) },
      { value: 'limit', label: intl.formatMessage({ defaultMessage: '限價委托', id: 'udpXUo' }) },
    ],
    [intl],
  );

  const [orderTypeOption, setOrderTypeOption] = useState<any>(orderTypeOptions[0]);

  const [hand, setHand] = useState<string>('0');

  const [price, setPrice] = useState<string>();

  const calcPrice = useMemo(() => {
    if (orderTypeOption.value === 'limit' && price?.trim().length) {
      return price;
    }
    return '0';
  }, [orderTypeOption.value, price]);

  const { data: orderCheckOutUsdt, refetch: refetchCheckOutUsdt } = useProOrderCheckOutUsdt(
    {
      symbol: symbol ?? '',
      buySell: buySell === 1 ? 'buy' : 'sell',
      price: calcPrice,
      hand,
      multiNum: '',
      orderType: orderTypeOption.value,
      type: '2',
    },
    {
      query: {
        enabled: buySell === 1,
      },
    },
  );

  const { data: orderCheckOut, refetch: refetchCheckOut } = useProOrderCheckOut(
    {
      symbol: symbol ?? '',
      buySell: buySell === 1 ? 'buy' : 'sell',
      price: calcPrice,
      hand,
      multiNum: '',
      orderType: orderTypeOption.value,
      type: '2',
    },
    {
      query: {
        enabled: buySell === -1,
      },
    },
  );

  const openHand = orderCheckOutUsdt?.data?.openHand;
  const maxOpenBail = Number(orderCheckOutUsdt?.data?.maxOpenBail ?? 0);

  const openBail = orderCheckOut?.data?.openBail;
  const availableAmount = orderCheckOut?.data?.availableAmount;

  useEffect(() => {
    if (quote) {
      setPrice(quote.last);
    }
  }, [quote]);

  const proOrderOpen = useProOrderOpen({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          onCreateOrderSuccess?.();
          refetchCheckOut();
          refetchCheckOutUsdt();
          homeAccount.refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  const plusOrMinus = useCallback(
    (isPlus: boolean) => {
      if (!price || !price.trim().length) return;

      const priceDecimals = Number(config?.priceDecimals ?? 2);

      let d = Number(price);

      const unit = 1 / Math.pow(10, priceDecimals);

      if (isPlus) {
        d += unit;
      } else {
        d -= unit;
      }

      setPrice(currency(d, { separator: '', precision: priceDecimals, symbol: '' }).format());
    },
    [config?.priceDecimals, price],
  );

  const homeAccount = useHomeAccount();

  const [mode] = useAtom(darkModeAtom);
  const colourStyles: StylesConfig = {
    container: (styles) => ({ ...styles, padding: 0, backgroundColor: '#666' }),
    control: (styles, state) => ({
      ...styles,
      borderColor: mode === 'dark' ? '#666666' : '#ececec',
      boxShadow: undefined,
      borderRadius: 0,
      padding: 0,
      backgroundColor: mode === 'dark' ? '#2A2E38' : 'transparent',
      color: '#fff',
    }),
    option: (styles, { isSelected }) => {
      return {
        ...styles,
        color: mode === 'dark' ? '#fff' : '#727fa5',
        backgroundColor:
          mode === 'dark'
            ? isSelected
              ? '#3D424E'
              : '#4F5463'
            : isSelected
              ? '#d9d8dd'
              : undefined,
      };
    },
    input: (styles) => ({ ...styles, margin: 0, padding: 0 }),
    singleValue: (styles) => ({
      ...styles,
      color: mode === 'dark' ? '#fff' : '#666175ae',
      margin: 0,
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (styles) => ({ ...styles, paddingLeft: 0 }),
    valueContainer: (styles) => ({ ...styles, paddingRight: 0 }),
    menu(base, props) {
      return { ...base, padding: 0, margin: 0 };
    },
    menuList(base, props) {
      return { padding: 0 };
    },
  };

  return (
    <Container buySell={buySell ?? 1} mode={mode}>
      <div className="flex gap-2 text-sm">
        <Select
          value={orderTypeOption}
          onChange={setOrderTypeOption}
          options={orderTypeOptions}
          styles={colourStyles}
          className="w-full"
          placeholder={intl.formatMessage({ defaultMessage: '請選擇', id: 'fINI3k' })}
        />
      </div>

      {orderTypeOption.value === 'market' ? (
        <div className="mt-2 flex h-10 items-center justify-center bg-[#f2f2f2] text-xs text-[#666175ae] dark:bg-[#161720] dark:text-white">
          {intl.formatMessage({ defaultMessage: '以當前最優價格交易', id: 'VXMi89' })}
        </div>
      ) : (
        <div className="mt-2.5 flex items-center border border-gray-300 dark:border-[#666666]">
          <Input
            type="number"
            placeholder={intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
            maxLength={18}
            className="flex-1 pl-2.5"
            value={price}
            onChange={setPrice}
          />
          <div className="h-8 w-[1px] bg-gray-300 dark:bg-[#666666]"></div>
          <a
            className="flex w-10 items-center justify-center text-lg font-bold text-gray-300"
            onClick={() => plusOrMinus(false)}
          >
            -
          </a>
          <div className="h-6 w-[1px] bg-gray-300 dark:bg-[#666666]"></div>
          <a
            className="flex w-10 items-center justify-center text-lg font-bold text-gray-300"
            onClick={() => plusOrMinus(true)}
          >
            +
          </a>
        </div>
      )}

      <div className="mt-2 flex h-10 items-center rounded-sm border border-[#efefef] px-2 dark:border-[#666666]">
        <Input
          value={hand}
          onChange={setHand}
          type="number"
          className="text-sm font-bold"
          placeholder={intl.formatMessage({ defaultMessage: '請輸入手數', id: 'Tw8y2o' })}
          maxLength={18}
        />
        <span className="text-[#666175ae] dark:text-[#999999]">
          {buySell === 1 ? 'USDT' : symbol}
        </span>
      </div>

      <div className="mt-2 flex border-[#efefef]">
        {config?.openRateList?.map((v, i) => {
          const precision = Number(availableAmount?.split('.')?.[1]?.length ?? 2);

          const _hand =
            buySell === 1
              ? String(maxOpenBail * (v / 100))
              : currency(availableAmount ?? '0', {
                  symbol: '',
                  separator: '',
                  precision,
                })
                  .multiply(v / 100)
                  .format();
          return (
            <a
              className={`hand flex flex-1 items-center justify-center py-2 ${
                hand === _hand ? 'active' : ''
              }`}
              key={i}
              onClick={() => {
                if (buySell === 1) {
                  refetchCheckOutUsdt();
                } else {
                  refetchCheckOut();
                }
                setHand(_hand);
                homeAccount.refetch();
              }}
            >{`${v}%`}</a>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div>
          <div className="text-[#6175ae] dark:text-white">
            {buySell === 1
              ? intl.formatMessage(
                  { defaultMessage: '可用: {amount}{symbol}', id: 'YtQA/s' },
                  { amount: homeAccount.data?.data?.spotAccount?.holdAmount, symbol: 'USDT' },
                )
              : intl.formatMessage(
                  { defaultMessage: '可賣: {amount}{symbol}', id: '3Bnag5' },
                  {
                    amount: availableAmount,
                    symbol: symbol,
                  },
                )}
          </div>
          {buySell === -1 && <div className="mt-3 text-gray-400">{openBail}</div>}
        </div>
      </div>

      <div>
        <a
          className="mt-2 flex h-11 items-center justify-center rounded text-sm text-white"
          style={{ backgroundColor: buySell === 1 ? '#00AD88' : '#E2214E' }}
          onClick={() => {
            if (orderTypeOption.value === 'limit' && !calcPrice) {
              Toast.show(intl.formatMessage({ defaultMessage: '請輸入價格', id: 'bW0/mN' }));
              return;
            }

            proOrderOpen.mutate({
              data: {
                usdtAmount: hand,
                symbol: symbol ?? '',
                price: calcPrice,
                buySell: buySell === 1 ? 'buy' : 'sell',
                hand: buySell === 1 ? openHand : hand || '0',
                multiNum: '',
                orderType: orderTypeOption.value,
                type: '2',
              },
            });
          }}
        >
          {buySell === 1
            ? intl.formatMessage({ defaultMessage: '買入', id: 'sY5/oP' })
            : intl.formatMessage({ defaultMessage: '賣出', id: 'EOWvn9' })}
        </a>
      </div>
    </Container>
  );
};

const Container = styled.div<{ buySell: number; mode: 'dark' | 'light' }>`
  .hand {
    border: ${(props) => (props.mode === 'dark' ? '1px solid #666666' : '1px solid #f3f3f3')};
    &:active {
      border-color: ${(props) => (props.buySell === 1 ? '#00AD88' : '#E2214E')};
      color: ${(props) => (props.buySell === 1 ? '#00AD88' : '#E2214E')};
      z-index: 1;
    }
    &:not(:last-child) {
      margin-right: -1px;
    }
  }
  .adm-input-element {
    &::placeholder {
      color: #c8c8c8;
    }
  }
  .adm-selector {
    --padding: 8px 12px;
    .adm-selector-item {
      border: 1px solid #f0f0f1;
      background-color: #fff;
      color: #666175ae;

      &.adm-selector-item-active {
        background-color: #6175ae;
        color: #fff;
      }
    }
  }
`;

export default TradeLeverDetails;
