import { Button, List, Popup } from 'antd-mobile';
import currency from 'currency.js';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useOtcCreateOrder } from '../../api/endpoints/transformer';
import { OtcFindAdListItem, Receipt } from '../../api/model';
import { symbols } from '../../utils/symbols';

interface ConfirmSellDialogProps {
  open: boolean;
  onClose: () => void;
  receipt?: Receipt;
  optionalOrder?: OtcFindAdListItem;
  symbol: string;
  amount: string;
}
const ConfirmSellDialog = ({
  open,
  onClose,
  receipt,
  optionalOrder,
  symbol,
  amount,
}: ConfirmSellDialogProps) => {
  const otcCreateOrder = useOtcCreateOrder({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          // TODO 获取orderId 跳详情页面
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (receipt && optionalOrder) {
      otcCreateOrder.mutate({
        data: {
          buySell: 'sell',
          adId: optionalOrder.adId ?? '',
          amount,
          price: optionalOrder.price ?? '',
          showReceiptType: Number(receipt.receiptType),
        },
      });
    }
  }, [amount, optionalOrder, otcCreateOrder, receipt]);

  return (
    <Container visible={open} onClose={onClose} closeOnMaskClick>
      <div className="flex flex-col">
        <span className="h-16 flex items-center px-4 text-base font-bold text-[#3D3A50]">
          確認出售
        </span>

        <div className="px-2 mb-4">
          <List className="mb-4">
            <List.Item
              title="收款方式"
              extra={<span className="text-[#3D3A50]">{receipt?.receiptTypeValue}</span>}
            />
            <List.Item
              title="單價"
              extra={
                <span className="text-[#3D3A50]">{optionalOrder?.price + symbol + '/USDT'}</span>
              }
            />
            <List.Item
              title="數量"
              extra={<span className="text-[#3D3A50]">{`${amount} USDT`}</span>}
            />
            <List.Item
              title="實收款"
              extra={
                <span className="text-[#6175AE] font-bold text-xl">
                  {currency(amount)
                    .multiply(optionalOrder?.price ?? 1)
                    .format({ symbol: symbols[symbol] })}
                </span>
              }
            />
          </List>
        </div>
        <div className="px-4 mb-4">
          <Button block color="primary" onClick={handleFinish}>
            確認出售
          </Button>
        </div>
      </div>
    </Container>
  );
};

const Container = styled(Popup)`
  .adm-list-body {
    border: 0;
  }
`;

export default ConfirmSellDialog;
