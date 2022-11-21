import { Modal, Radio } from 'antd-mobile';
import { useMemo } from 'react';
import styled from 'styled-components';

interface OrderCancelDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const OrderCancelDialog = ({ open, onClose, onSubmit }: OrderCancelDialogProps) => {
  const actions = useMemo(
    () => [
      {
        key: 'cancel',
        text: '我再想想',
        onClick: onClose,
      },
      {
        key: 'ok',
        text: '確定',
        onClick: onSubmit,
      },
    ],
    [onClose, onSubmit],
  );

  return (
    <Container
      title="確認取消訂單"
      visible={open}
      content={
        <div className="flex flex-col text-xs text-[#6175AE]">
          <span>如您已經向賣家付款，請不要取消訂單</span>
          <span className="text-black mt-1">
            取消規則：買家當日累計4筆取消， 會限制當日買入功能。
          </span>
          <Radio className="mt-2">我確認還沒有付款給對方</Radio>
        </div>
      }
      actions={actions}
      destroyOnClose
    />
  );
};

const Container = styled(Modal)`
  .adm-center-popup-body {
    border-radius: 4px;

    .adm-modal-title {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
    }

    .adm-radio {
      --icon-size: 14px;
      --font-size: 12px;
      --gap: 6px;
      display: flex;
      align-items: center;
      color: #333;
    }
  }
`;

export default OrderCancelDialog;
