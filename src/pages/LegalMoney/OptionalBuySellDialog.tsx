import { Button, Input, InputRef, List, Popup, Toast } from 'antd-mobile';
import { useMemo, useRef, useState } from 'react';
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
  const isBuyer = useMemo(() => 'buy' === optionalOrder?.buySell, [optionalOrder?.buySell]);
  const title = isBuyer ? '出售USDT' : '購買USDT';
  const amountHint = isBuyer ? '請輸入出售數量' : '請輸入購買數量';
  const all = isBuyer ? '全部出售' : '全部買入';

  const payWay = isBuyer ? '實收款' : '實付款';

  const ref = useRef<InputRef>(null);

  const [amount, setAmount] = useState<string>('');

  const { data: accountOutHoldAmount } = useAccountOutHoldAmount(
    { accountType: 'balance' },
    {
      query: {
        enabled: !isBuyer,
      },
    },
  );

  const holdAmount = useMemo(
    () => accountOutHoldAmount?.data?.holdAmount ?? '0.00',
    [accountOutHoldAmount?.data?.holdAmount],
  );

  return (
    <Container visible={open} onClose={onClose} closeOnMaskClick>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#3D3A50] h-16 flex items-center">{title}</span>
          {isBuyer && <Transfer />}
        </div>

        <div className="relative flex items-center h-12 px-4 border border-[#465B98]">
          <Input
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder={amountHint}
            maxLength={18}
            className="pl2 pr-28 text-[#9A9A9A]"
            ref={ref}
          />
          <div className="flex items-center absolute right-4 text-[#9A9A9A] text-xs">
            <span>USDT</span>
            <span className=" h-5 mx-4 bg-gray-300 w-[1px]"></span>
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

        <div className="mt-2 text-[#9A9A9A] text-xs">
          <span className="mt-1" key="limit">
            限額{optionalOrder?.minCny}USDT-{optionalOrder?.maxCny}USDT
          </span>
          {isBuyer && (
            <span className="ml-4 mt-1" key="balance">
              餘額{holdAmount}USDT
            </span>
          )}
        </div>

        <div className=" mt-8">
          <List>
            <List.Item
              title="單價"
              extra={
                <span>
                  {optionalOrder?.price}
                  {optionalOrder?.currencySign}/USDT
                </span>
              }
            />
            <List.Item title="數量" extra={<span>----</span>} />
            <List.Item
              title={payWay}
              extra={<span className="text-[#c6175ae] text-xl font-bold">----</span>}
            />
          </List>
        </div>

        <div className="my-8 flex items-center">
          <Button block fill="none" onClick={onClose}>
            {optionalOrder && (
              <Countdown
                defaultCount={Number(optionalOrder?.timeLimit ?? 0)}
                onFinish={() => {
                  Toast.show('操作超時');
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
            下單
          </Button>
        </div>
      </div>
    </Container>
  );
};

const Countdown = ({ defaultCount, onFinish }: { defaultCount: number; onFinish?: () => void }) => {
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
    count ? 1000 : null,
  );
  return <span>{count}後自動取消</span>;
};

const Container = styled(Popup)`
  .adm-list-body {
    border: 0;
  }
`;

export default OptionalBuySellDialog;
