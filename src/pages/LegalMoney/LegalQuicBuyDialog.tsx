import { Button, List, Popup, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { orderBy } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useOtcCreateOrder } from '../../api/endpoints/transformer';
import { OtcFindAdListItem } from '../../api/model';

import { ReactComponent as SelectedSvg } from '../../assets/ic_svg_selected.svg';

const symbols: { [key: string]: string } = {
  CNY: '￥',
  HKD: 'HK＄',
  USD: '＄',
};

interface PayWay {
  bankName: string;
  paymentId: string;
  receiptLogo: string;
  receiptName: string;
  receiptNo: string;
  receiptType: number;
  receiptTypeValue: string;
  sort: number;
}

interface LegalQuicBuyDialogProps {
  optionalOrder?: OtcFindAdListItem;
  symbol: string;
  amount: string;
  open: boolean;
  onClose: () => void;
}

const LegalQuicBuyDialog = ({
  open,
  onClose,
  optionalOrder,
  symbol,
  amount,
}: LegalQuicBuyDialogProps) => {
  const [selectedPayWay, setSelectedPayWay] = useState<PayWay>();

  const options = useMemo(() => {
    let result: PayWay[] = [];
    if (optionalOrder?.payWay) {
      try {
        result = JSON.parse(optionalOrder.payWay) as PayWay[];
        result = orderBy(result, ['sort'], ['asc']);
      } catch (error) {
        /* empty */
      }
    }
    return result;
  }, [optionalOrder?.payWay]);

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
          // TODO 跳详情页面
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!optionalOrder) return;

    if (selectedPayWay?.receiptType === -1) {
      Toast.show('請選擇商家收款方式');
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
  }, [amount, optionalOrder, otcCreateOrder, selectedPayWay?.receiptType]);

  return (
    <Container position="bottom" visible={open} onClose={onClose} destroyOnClose closeOnMaskClick>
      <div className="flex flex-col px-4">
        <span className=" h-16 flex items-center text-base font-bold text-[#3D3A50]">確認購買</span>
        <div className="h-14 relative overflow-x-auto">
          <div className="h-full flex absolute">
            {options.map((v, i) => (
              <div
                key={i}
                className="h-12 w-[110px] flex flex-col justify-center border border-[#6175AE] text-[#F9F9FC] rounded px-2 mr-2"
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
                  <span className="text-[#6175AE] py-[2px] px-1 scale-[0.85]">價格最優</span>
                  <SelectedSvg className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <List className="mt-4">
          <List.Item title="價格" extra={optionalOrder?.price + symbol + '/USDT'} />
          <List.Item title="數量" extra={`${amount} USDT`} />
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
            確認購買
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
export default LegalQuicBuyDialog;
