import { Button, List, Popup } from 'antd-mobile';
import currency from 'currency.js';
import { stringify } from 'query-string';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const otcCreateOrder = useOtcCreateOrder({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          history.push({
            pathname: '/legal-order-info',
            search: stringify({ orderId: data.data?.orderId }),
          });
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
          showReceiptType: receipt.receiptType,
        },
      });
    }
  }, [amount, optionalOrder, otcCreateOrder, receipt]);

  const intl = useIntl();

  return (
    <Container visible={open} onClose={onClose} closeOnMaskClick>
      <div className="flex flex-col">
        <span className="flex h-16 items-center px-4 text-base font-bold text-[#3D3A50]">
          {intl.formatMessage({ defaultMessage: '確認出售', id: 'qGoxr9' })}
        </span>

        <div className="mb-4 px-2">
          <List className="mb-4">
            <List.Item
              title={intl.formatMessage({ defaultMessage: '收款方式', id: 'UA7E9h' })}
              extra={<span className="text-[#3D3A50]">{receipt?.receiptTypeValue}</span>}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '單價', id: 'WyPuru' })}
              extra={
                <span className="text-[#3D3A50]">{optionalOrder?.price + symbol + '/USDT'}</span>
              }
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
              extra={<span className="text-[#3D3A50]">{`${amount} USDT`}</span>}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '實收款', id: 'n/ayb0' })}
              extra={
                <span className="text-xl font-bold text-[#6175AE]">
                  {currency(amount)
                    .multiply(optionalOrder?.price ?? 1)
                    .format({ symbol: symbols[symbol] })}
                </span>
              }
            />
          </List>
        </div>
        <div className="mb-4 px-4">
          <Button block color="primary" onClick={handleFinish}>
            {intl.formatMessage({ defaultMessage: '確認出售', id: 'qGoxr9' })}
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
