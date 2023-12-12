import { Input, Selector, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import styled from 'styled-components';
import { useProOrderCheckOut, useProOrderOpen } from '../../api/endpoints/transformer';
import { ProOrderConfigResponseAllOfData } from '../../api/model';
import { QuoteReal } from '../../market/model';

const colourStyles = {
  container: (styles: any) => ({ ...styles, padding: 0 }),
  control: (styles: any) => ({
    ...styles,
    borderColor: '#ececec',
    boxShadow: '',
    borderRadius: 0,
    padding: 0,
  }),
  option: (styles: any, { isSelected }: any) => {
    return {
      ...styles,
      color: '#727fa5',
      backgroundColor: isSelected ? '#d9d8dd' : undefined,
    };
  },
  input: (styles: any) => ({ ...styles, margin: 0, padding: 0 }),
  singleValue: (styles: any) => ({ ...styles, color: '#666175ae', margin: 0 }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, paddingLeft: 0 }),
  valueContainer: (styles: any) => ({ ...styles, paddingRight: 0 }),
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

  const { data: orderCheckOut, refetch: refetchCheckOut } = useProOrderCheckOut({
    symbol: symbol ?? '',
    buySell: buySell === 1 ? 'buy' : 'sell',
    price: calcPrice,
    hand: hand || '0',
    multiNum: leverMultiple,
    orderType: orderTypeOption.value,
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

  return (
    <Container>
      <div className="flex gap-2 text-sm">
        <Select
          value={orderTypeOption}
          onChange={setOrderTypeOption}
          options={orderTypeOptions}
          styles={colourStyles}
          className="w-1/2"
          placeholder={intl.formatMessage({ defaultMessage: '請選擇', id: 'fINI3k' })}
        />

        {config?.accountType !== 'stock' && (
          <Select
            value={multiNumOption}
            onChange={setMultiNumOption}
            options={multiNumOptions}
            styles={colourStyles}
            className="w-1/2"
            placeholder={intl.formatMessage({ defaultMessage: '請選擇', id: 'fINI3k' })}
          />
        )}
      </div>

      {orderTypeOption.value === 'market' ? (
        <div className="mt-2 flex h-10 items-center justify-center bg-[#f2f2f2] text-xs text-[#666175ae]">
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
          <div className="h-8 w-[1px] bg-gray-300"></div>
          <a
            className="flex w-10 items-center justify-center text-lg font-bold text-gray-300"
            onClick={() => plusOrMinus(false)}
          >
            -
          </a>
          <div className="h-6 w-[1px] bg-gray-300"></div>
          <a
            className="flex w-10 items-center justify-center text-lg font-bold text-gray-300"
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

      <div className="mt-2 flex h-10 items-center rounded-sm border border-[#efefef] px-2">
        <Input
          value={hand}
          onChange={setHand}
          type="number"
          className="text-sm font-bold"
          placeholder={intl.formatMessage({ defaultMessage: '請輸入手數', id: 'Tw8y2o' })}
          maxLength={18}
        />
        <span className="text-[#666175ae]">
          {intl.formatMessage({ defaultMessage: '手', id: 'ohYFAy' })}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs">
        <div>
          <div className="text-[#6175ae]">
            {intl.formatMessage(
              { defaultMessage: '可開{maxHand}手', id: 'xCJREC' },
              { maxHand: orderCheckOut?.data?.maxHand },
            )}
          </div>
          <div className="mt-3 text-gray-400">
            {intl.formatMessage({ defaultMessage: '開倉保證金', id: 'H4vld2' })}
            {orderCheckOut?.data?.openBail}
          </div>
        </div>

        <Link to="/transfer-coin" className="w-12 bg-[#6175ae] py-1.5 text-center text-white">
          {intl.formatMessage({ defaultMessage: '划轉', id: 'UD6XMk' })}
        </Link>
      </div>

      <div>
        <a
          className="mt-4 flex h-12 items-center justify-center text-sm text-white"
          style={{ backgroundColor: buySell === 1 ? '#E2214E' : '#00AD88' }}
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
                hand: hand ?? '0',
                multiNum: leverMultiple,
                orderType: orderTypeOption.value,
              },
            });
          }}
        >
          {buySell === 1
            ? intl.formatMessage({ defaultMessage: '看漲(做多)', id: 'cBWJI5' })
            : intl.formatMessage({ defaultMessage: '看跌(做空)', id: 'uy59Hz' })}
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
