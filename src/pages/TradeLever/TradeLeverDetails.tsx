import { Input, Selector, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Select, { StylesConfig } from 'react-select';
import styled from 'styled-components';
import { useProOrderCheckOut, useProOrderOpen } from '../../api/endpoints/transformer';
import { ProOrderConfigResponseAllOfData } from '../../api/model';
import { QuoteReal } from '../../market/model';

const orderTypeOptions = [
  { value: 'market', label: '市價委托' },
  { value: 'limit', label: '限價委托' },
];

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
  const [orderTypeOption, setOrderTypeOption] = useState<any>(orderTypeOptions[0]);
  const [multiNumOption, setMultiNumOption] = useState<any>();
  const [multiNumOptions, setMultiNumOptions] = useState<any[]>([]);

  const [hand, setHand] = useState<string>('');

  useEffect(() => {
    const options =
      config?.multiNumList?.map((v) => ({
        label: `${v}X`,
        value: `${v}`,
      })) ?? [];
    setMultiNumOption(options[0]);
    setMultiNumOptions(options);
  }, [config?.multiNumList]);

  const leverMultiple = useMemo(
    () => (config?.accountType === 'stock' ? '1' : multiNumOption?.value ?? ''),
    [config?.accountType, multiNumOption?.value],
  );

  const [price, setPrice] = useState<string>();

  const calcPrice = useMemo(() => {
    if (orderTypeOption.value === 'limit' && price?.trim().length) {
      return price;
    }

    return '0';
  }, [orderTypeOption.value, price]);

  const { data: orderCheckOut, refetch: refetchCheckOut } = useProOrderCheckOut(
    {
      symbol: symbol ?? '',
      buySell: buySell === 1 ? 'buy' : 'sell',
      price: calcPrice,
      hand: hand ?? '0',
      multiNum: leverMultiple,
      orderType: orderTypeOption.value,
    },
    {
      query: {
        enabled: !!hand,
      },
    },
  );

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

  return (
    <Container>
      <div className="flex text-sm gap-2">
        <Select
          value={orderTypeOption}
          onChange={setOrderTypeOption}
          options={orderTypeOptions}
          styles={colourStyles}
          className="w-1/2"
          placeholder="請選擇"
        />

        {config?.accountType !== 'stock' && (
          <Select
            value={multiNumOption}
            onChange={setMultiNumOption}
            options={multiNumOptions}
            styles={colourStyles}
            className="w-1/2"
            placeholder="請選擇"
          />
        )}
      </div>

      {orderTypeOption.value === 'market' ? (
        <div className="flex items-center justify-center text-xs text-[#666175ae] h-10 mt-2 bg-[#f2f2f2]">
          以當前最優價格交易
        </div>
      ) : (
        <div className="mt-2.5 flex items-center border border-gray-300">
          <Input
            type="number"
            placeholder="價格"
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

      <Selector
        className="mt-2 text-xs"
        columns={4}
        options={config?.initHandList?.map((v) => ({ label: v, value: `${v}` })) ?? []}
        showCheckMark={false}
        onChange={(value) => {
          if (value.length) {
            setHand(value[0]);
          }
        }}
      />

      <div className="mt-2 flex items-center border border-[#efefef] h-10 px-2 rounded-sm">
        <Input
          value={hand}
          onChange={setHand}
          type="number"
          className="text-sm font-bold"
          placeholder="請輸入手數"
          maxLength={18}
        />
        <span className="text-[#666175ae]">手</span>
      </div>

      <div className="mt-1 text-xs flex items-center justify-between">
        <div>
          <div className="text-[#6175ae]">可開{orderCheckOut?.data?.maxHand}手</div>
          <div className="text-gray-400 mt-3">開倉保證金{orderCheckOut?.data?.openBail}</div>
        </div>

        <Link to="/transfer-coin" className="bg-[#6175ae] text-center text-white py-1.5 w-12">
          划轉
        </Link>
      </div>

      <div>
        <a
          className="flex items-center justify-center h-12 text-white mt-4 text-sm"
          style={{ backgroundColor: buySell === 1 ? '#E2214E' : '#00AD88' }}
          onClick={() => {
            if (orderTypeOption.value === 'limit' && !calcPrice) {
              Toast.show('請輸入價格');
              return;
            }

            proOrderOpen.mutate({
              data: {
                symbol: symbol ?? '',
                price: calcPrice,
                buySell: buySell === 1 ? 'buy' : 'sell',
                hand: hand ?? '0',
                multiNum: leverMultiple,
                orderType: orderTypeOption.value,
              },
            });
          }}
        >
          {buySell === 1 ? '看漲(做多)' : '看跌(做空)'}
        </a>
      </div>
    </Container>
  );
};

const Container = styled.div`
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
