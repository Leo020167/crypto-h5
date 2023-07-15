import { Button, Input, InputRef, List, Popup, Toast } from 'antd-mobile';
import { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { useAccountOutHoldAmount } from '../../api/endpoints/transformer';
import { OtcCreateOrderBody, OtcFindAdListItem } from '../../api/model';
import Transfer from './Transfer';

interface OptionalBuySellDialogProps {
  optionalOrder?: OtcFindAdListItem;
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: OtcCreateOrderBody) => void;
}
const OptionalBuySellDialog = ({
  optionalOrder,
  open,
  onClose,
  onSubmit,
}: OptionalBuySellDialogProps) => {
  const intl = useIntl();

  const isBuyer = useMemo(
    () => 'buy' === optionalOrder?.buySell,
    [optionalOrder?.buySell]
  );
  const title = isBuyer
    ? intl.formatMessage({ defaultMessage: '出售USDT', id: 'Bj/Ifv' })
    : intl.formatMessage({ defaultMessage: '購買USDT', id: 'HeL/t7' });

  const amountHint = isBuyer
    ? intl.formatMessage({ defaultMessage: '請輸入出售數量', id: 'RXYW6s' })
    : intl.formatMessage({ defaultMessage: '請輸入購買數量', id: 'ap+l4f' });

  const all = isBuyer
    ? intl.formatMessage({ defaultMessage: '全部出售', id: 'V4Iau9' })
    : intl.formatMessage({ defaultMessage: '全部買入', id: 'CTWCcu' });

  const payWay = isBuyer
    ? intl.formatMessage({ defaultMessage: '實收款', id: 'n/ayb0' })
    : intl.formatMessage({ defaultMessage: '實付款', id: 'Qg/P8m' });

  const ref = useRef<InputRef>(null);

  const [amount, setAmount] = useState<string>('');

  const { data: accountOutHoldAmount } = useAccountOutHoldAmount(
    { accountType: 'balance' },
    {
      query: {
        enabled: !isBuyer,
      },
    }
  );

  const holdAmount = useMemo(
    () => accountOutHoldAmount?.data?.holdAmount ?? '0.00',
    [accountOutHoldAmount?.data?.holdAmount]
  );

  const money = useMemo(() => {
    if (amount?.trim() === '') return '----';
    const result = (
      Number(amount || 0) * Number(optionalOrder?.price || 0)
    ).toFixed(2);
    return optionalOrder?.currencySign + result;
  }, [amount, optionalOrder?.currencySign, optionalOrder?.price]);

  return (
    <Container
      visible={open}
      onClose={() => {
        setAmount('');
        onClose?.();
      }}
      closeOnMaskClick
    >
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <span className="flex h-16 items-center text-base font-bold text-[#3D3A50]">
            {title}
          </span>
          {isBuyer && <Transfer />}
        </div>

        <div className="relative flex h-12 items-center border border-[#465B98] px-4">
          <Input
            type="number"
            min={0}
            clearable
            value={amount}
            onChange={setAmount}
            placeholder={amountHint}
            maxLength={18}
            className="pl2 pr-28 text-[#9A9A9A]"
            ref={ref}
          />
          <div className="absolute right-4 flex items-center text-xs text-[#9A9A9A]">
            <span>USDT</span>
            <span className=" mx-4 h-5 w-[1px] bg-gray-300"></span>
            <a
              className="text-[#6175AE]"
              onClick={() => {
                if (isBuyer) {
                  setAmount(holdAmount);
                } else {
                  setAmount(optionalOrder?.amount ?? '0.00');
                }

                ref.current?.focus();
              }}
            >
              {all}
            </a>
          </div>
        </div>

        <div className="mt-2 text-xs text-[#9A9A9A]">
          <span className="mt-1" key="limit">
            {intl.formatMessage({ defaultMessage: '限額', id: 'zGwnHi' })}
            {optionalOrder?.minCny}USDT-{optionalOrder?.maxCny}USDT
          </span>
          {isBuyer && (
            <span className="ml-4 mt-1" key="balance">
              {intl.formatMessage({ defaultMessage: '餘額', id: 'hPHyre' })}
              {holdAmount}USDT
            </span>
          )}
        </div>

        <div className=" mt-8">
          <List>
            <List.Item
              title={intl.formatMessage({
                defaultMessage: '單價',
                id: 'WyPuru',
              })}
              extra={
                <span>
                  {optionalOrder?.price}
                  {optionalOrder?.currencySign}/USDT
                </span>
              }
            />
            <List.Item
              title={intl.formatMessage({
                defaultMessage: '數量',
                id: 'YYra8Q',
              })}
              extra={<span>{amount ? amount + ' USDT' : '----'}</span>}
            />
            <List.Item
              title={payWay}
              extra={
                <span className="text-xl font-bold text-[#c6175ae]">
                  {money}
                </span>
              }
            />
          </List>
        </div>

        <div className="my-8 flex items-center">
          <Button block fill="none" onClick={onClose}>
            {optionalOrder && (
              <Countdown
                defaultCount={Number(optionalOrder?.timeLimit ?? 0)}
                onFinish={() => {
                  Toast.show(
                    intl.formatMessage({
                      defaultMessage: '操作超時',
                      id: 'VqH7F0',
                    })
                  );
                }}
              />
            )}
          </Button>

          <Button
            block
            color="primary"
            className="ml-4"
            onClick={() => {
              if (optionalOrder) {
                const buySell = isBuyer ? 'sell' : 'buy';
                onSubmit?.({
                  buySell,
                  adId: optionalOrder.adId ?? '',
                  amount,
                  price: optionalOrder.price ?? '',
                });
              }
            }}
          >
            {intl.formatMessage({ defaultMessage: '下單', id: 'PHMSxi' })}
          </Button>
        </div>
      </div>
    </Container>
  );
};

const Countdown = ({
  defaultCount,
  onFinish,
}: {
  defaultCount: number;
  onFinish?: () => void;
}) => {
  const [count, setCount] = useState<number>(defaultCount);
  useInterval(
    () => {
      const newValue = count - 1;
      if (newValue) {
        setCount(newValue);
      } else {
        onFinish?.();
      }
    },
    count ? 1000 : null
  );
  const intl = useIntl();
  return (
    <span>
      {count}
      {intl.formatMessage({ defaultMessage: '後自動取消', id: 'qxdWh5' })}
    </span>
  );
};

const Container = styled(Popup)`
  .adm-list-body {
    border: 0;
  }
`;

export default OptionalBuySellDialog;
