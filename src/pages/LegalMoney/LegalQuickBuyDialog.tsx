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
        <span className=" h-16 flex items-center text-base font-bold text-[#3D3A50]">
          {intl.formatMessage({ defaultMessage: '確認購買', id: 'ySnXcv' })}
        </span>
        <div className="h-14 relative overflow-x-auto">
          <div className="h-full flex absolute">
            {options.map((v, i) => (
              <div
                key={i}
                className="h-12 min-w-[110px] flex flex-col justify-center border border-[#6175AE] text-[#F9F9FC] rounded px-2 mr-2"
              >
                <div className="flex items-center justify-center h-full">
                  <span className="w-4 h-4">
                    {!!v.receiptLogo && <img alt="" src={v.receiptLogo} className="h-full" />}
                  </span>
                  <span className="text-xs text-[#3D3A50] ml-1">{v.receiptTypeValue}</span>
                  <span className="border border-[#6175AE] rounded text-xs text-[#6175AE] scale-[0.65] py-[2px] px-1">
                    推薦
                  </span>
                </div>

                <div className="flex items-center justify-between h-full">
                  <span className="text-[#6175AE] py-[2px] px-1 scale-[0.85]">
                    {intl.formatMessage({ defaultMessage: '價格最優', id: 'EYBWHx' })}
                  </span>
                  <SelectedSvg className="w-3.5 h-3.5" />
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
          <span className="text-[#6175AE] text-2xl font-bold">
            {currency(amount)
              .multiply(optionalOrder?.price ?? 1)
              .format({ symbol: symbols[symbol] })}
          </span>
        </div>

        <div className="px-4 my-6">
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
