import { Button, List, Popup, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useOtcCreateOrder } from '../../api/endpoints/transformer';
import { OtcFindAdListItem, Receipt } from '../../api/model';
import { ReactComponent as SelectedSvg } from '../../assets/ic_svg_selected.svg';
import { getReceipts } from '../../utils/response';
import { symbols } from '../../utils/symbols';

interface LegalQuickBuyDialogProps {
  optionalOrder?: OtcFindAdListItem;
  symbol: string;
  amount: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (orderId?: string) => void;
}

const LegalQuickBuyDialog = ({
  optionalOrder,
  symbol,
  amount,
  open,
  onClose,
  onSuccess,
}: LegalQuickBuyDialogProps) => {
  const [selectedPayWay, setSelectedPayWay] = useState<Receipt>();

  const options = useMemo(() => getReceipts(optionalOrder?.payWay), [optionalOrder?.payWay]);

  useEffect(() => {
    if (options.length) {
      setSelectedPayWay(options[0]);
    }
  }, [options]);

  const otcCreateOrder = useOtcCreateOrder({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          onSuccess(data.data?.orderId);
        }
      },
    },
  });

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!optionalOrder) return;

    if (selectedPayWay?.receiptType === '-1') {
      Toast.show(intl.formatMessage({ defaultMessage: '請選擇商家收款方式', id: 'xExi0z' }));
      return;
    }

    otcCreateOrder.mutate({
      data: {
        buySell: 'buy',
        adId: optionalOrder.adId ?? '',
        amount,
        price: optionalOrder.price ?? '',
        showReceiptType: selectedPayWay?.receiptType,
      },
    });
  }, [amount, intl, optionalOrder, otcCreateOrder, selectedPayWay?.receiptType]);

  return (
    <Container position="bottom" visible={open} onClose={onClose} destroyOnClose closeOnMaskClick>
      <div className="flex flex-col px-4">
        <span className=" flex h-16 items-center text-base font-bold text-[#3D3A50]">
          {intl.formatMessage({ defaultMessage: '確認購買', id: 'ySnXcv' })}
        </span>
        <div className="relative h-14 overflow-x-auto">
          <div className="absolute flex h-full">
            {options.map((v, i) => (
              <div
                key={i}
                className="mr-2 flex h-12 w-[110px] flex-col justify-center rounded border border-[#6175AE] px-2 text-[#F9F9FC]"
              >
                <div className="flex h-full items-center justify-center">
                  <span className="h-4 w-4">
                    {!!v.receiptLogo && <img alt="" src={v.receiptLogo} className="h-full" />}
                  </span>
                  <span className="ml-1 text-xs text-[#3D3A50]">{v.receiptTypeValue}</span>
                  <span className="scale-[0.65] rounded border border-[#6175AE] px-1 py-[2px] text-xs text-[#6175AE]">
                    推薦
                  </span>
                </div>

                <div className="flex h-full items-center justify-between">
                  <span className="scale-[0.85] px-1 py-[2px] text-[#6175AE]">
                    {intl.formatMessage({ defaultMessage: '價格最優', id: 'EYBWHx' })}
                  </span>
                  <SelectedSvg className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <List className="mt-4">
          <List.Item
            title={intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
            extra={optionalOrder?.price + symbol + '/USDT'}
          />
          <List.Item
            title={intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
            extra={`${amount} USDT`}
          />
        </List>

        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-[#6175AE]">
            {currency(amount)
              .multiply(optionalOrder?.price ?? 1)
              .format({ symbol: symbols[symbol] })}
          </span>
        </div>

        <div className="my-6 px-4">
          <Button block color="primary" onClick={handleFinish} loading={otcCreateOrder.isLoading}>
            {intl.formatMessage({ defaultMessage: '確認購買', id: 'ySnXcv' })}
          </Button>
        </div>
      </div>
    </Container>
  );
};

const Container = styled(Popup)`
  .adm-list-body {
    border-top: 0;
    .adm-list-item-content {
      border: 0;
    }

    .adm-list-item-content-extra {
      color: #3d3a50;
    }
  }
`;
export default LegalQuickBuyDialog;
