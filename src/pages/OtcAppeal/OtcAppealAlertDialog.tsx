import { Modal } from 'antd-mobile';
import { useMemo } from 'react';
import styled from 'styled-components';

interface OtcAppealAlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const OtcAppealAlertDialog = ({ open, onClose, onSubmit }: OtcAppealAlertDialogProps) => {
  const actions = useMemo(
    () => [
      {
        key: 'cancel',
        text: '取消',
        onClick: onClose,
      },
      {
        key: 'ok',
        text: '申訴',
        onClick: onSubmit,
      },
    ],
    [onClose, onSubmit],
  );

  return (
    <Container
      title="申訴提醒"
      visible={open}
      content={
        <div className="flex flex-col text-black  ">
          <span className="text-sm">
            提起申訴後資產將會凍結，申訴專員將介入本次交易，直至申訴結束。惡意申訴屬於擾亂平台正常運營秩序的行為，情節嚴重將凍結賬戶。
          </span>
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
  }
`;

export default OtcAppealAlertDialog;
