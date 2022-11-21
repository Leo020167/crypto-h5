import { Modal } from 'antd-mobile';
import { useMemo } from 'react';
import styled from 'styled-components';

interface InOutMarkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const InOutMarkDialog = ({ open, onClose, onSubmit }: InOutMarkDialogProps) => {
  const actions = useMemo(
    () => [
      {
        key: 'cancel',
        text: '取消',
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
      title="付款確認"
      visible={open}
      content={
        <div className="flex flex-col text-black  ">
          <span className="text-sm">請確認您已向賣家付款</span>
          <span className="mt-2 text-[#6175AE] text-xs">惡意點擊將直接凍結賬戶</span>
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

export default InOutMarkDialog;
