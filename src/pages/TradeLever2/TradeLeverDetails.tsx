import { Input, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import Select, { StylesConfig } from 'react-select';
import styled from 'styled-components';
import { useProOrderCheckOut, useProOrderOpen } from '../../api/endpoints/transformer';
import { ProOrderConfigResponseAllOfData } from '../../api/model';
import { QuoteReal } from '../../market/model';

const colourStyles: StylesConfig = {
  container: (styles) => ({ ...styles, padding: 0 }),
  control: (styles) => ({
    ...styles,
    borderColor: '#ececec',
    boxShadow: '',
    borderRadius: 0,
    padding: 0,
  }),
  option: (styles, { isSelected }) => {
    return {
      ...styles,
      color: '#727fa5',
      backgroundColor: isSelected ? '#d9d8dd' : undefined,
    };
  },
  input: (styles) => ({ ...styles, margin: 0, padding: 0 }),
  singleValue: (styles) => ({ ...styles, color: '#666175ae', margin: 0 }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (styles) => ({ ...styles, paddingLeft: 0 }),
  valueContainer: (styles) => ({ ...styles, paddingRight: 0 }),
};

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

  const [hand, setHand] = useState<string>('10');

  const [price, setPrice] = useState<string>();

  const calcPrice = useMemo(() => {
    if (orderTypeOption.value === 'limit' && price?.trim().length) {
      return price;
    }
    return '0';
  }, [orderTypeOption.value, price]);

  const { data: orderCheckOut, refetch: refetchCheckOut } = useProOrderCheckOut({
    symbol: symbol ?? '',
    buySell: buySell === 1 ? 'buy' : 'sell',
    price: calcPrice,
    hand,
    multiNum: '',
    orderType: orderTypeOption.value,
    type: '2',
  });

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

  const maxHand = useMemo(
    () => (buySell === 1 ? orderCheckOut?.data?.maxHand : orderCheckOut?.data?.availableAmount),
    [buySell, orderCheckOut?.data?.availableAmount, orderCheckOut?.data?.maxHand],
  );

  return (
    <Container buySell={buySell ?? 1}>
      <div className="flex text-sm gap-2">
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
        <div className="flex items-center justify-center text-xs text-[#666175ae] h-10 mt-2 bg-[#f2f2f2]">
          {intl.formatMessage({ defaultMessage: '以當前最優價格交易', id: 'VXMi89' })}
        </div>
      ) : (
        <div className="mt-2.5 flex items-center border border-gray-300">
          <Input
            type="number"
            placeholder={intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
            maxLength={18}
            className="flex-1 pl-2.5"
            value={price}
            onChange={setPrice}
          />
          <div className="h-8 bg-gray-300 w-[1px]"></div>
          <a
            className="text-lg font-bold text-gray-300 w-10 flex items-center justify-center"
            onClick={() => plusOrMinus(false)}
          >
            -
          </a>
          <div className="h-6 bg-gray-300 w-[1px]"></div>
          <a
            className="text-lg font-bold text-gray-300 w-10 flex items-center justify-center"
            onClick={() => plusOrMinus(true)}
          >
            +
          </a>
        </div>
      )}

      <div className="mt-2 flex items-center border border-[#efefef] h-10 px-2 rounded-sm">
        <Input
          value={hand}
          onChange={setHand}
          type="number"
          className="text-sm font-bold"
          placeholder={intl.formatMessage({ defaultMessage: '請輸入手數', id: 'Tw8y2o' })}
          maxLength={18}
        />
        <span className="text-[#666175ae]">{symbol}</span>
      </div>

      <div className="mt-3 text-xs flex items-center justify-between">
        <div>
          <div className="text-[#6175ae]">
            {buySell === 1
              ? intl.formatMessage({ defaultMessage: '可買', id: 'HdFt0P' })
              : intl.formatMessage({ defaultMessage: '可賣', id: '4zwWgi' })}
            {intl.formatMessage(
              { defaultMessage: '{maxHand}{symbol}', id: '/jAa8w' },
              {
                maxHand,
                symbol,
              },
            )}
          </div>
          <div className="text-gray-400 mt-3">{orderCheckOut?.data?.openBail ?? '0 USDT'}</div>
        </div>
      </div>

      <div>
        <a
          className="flex items-center justify-center h-12 text-white mt-2 text-sm"
          style={{ backgroundColor: buySell === 1 ? '#00AD88' : '#E2214E' }}
          onClick={() => {
            if (orderTypeOption.value === 'limit' && !calcPrice) {
              Toast.show(intl.formatMessage({ defaultMessage: '請輸入價格', id: 'bW0/mN' }));
              return;
            }

            proOrderOpen.mutate({
              data: {
                symbol: symbol ?? '',
                price: calcPrice,
                buySell: buySell === 1 ? 'buy' : 'sell',
                hand: hand || '0',
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

const Container = styled.div<{ buySell: number }>`
  .hand {
    border: 1px solid #f3f3f3;
    &:active {
      border-color: ${(props) => (props.buySell === 1 ? '#00AD88' : '#E2214E')};
      color: ${(props) => (props.buySell === 1 ? '#00AD88' : '#E2214E')};
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
      color: #666175ae;
      background-color: #fff;
      border: 1px solid #f0f0f1;

      &.adm-selector-item-active {
        color: #fff;
        background-color: #6175ae;
      }
    }
  }
`;

export default TradeLeverDetails;
