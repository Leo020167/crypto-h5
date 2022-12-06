import { Modal } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

interface InOutMarkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const InOutMarkDialog = ({ open, onClose, onSubmit }: InOutMarkDialogProps) => {
  const intl = useIntl();
  const actions = useMemo(
    () => [
      {
        key: 'cancel',
        text: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
        onClick: onClose,
      },
      {
        key: 'ok',
        text: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
        onClick: onSubmit,
      },
    ],
    [intl, onClose, onSubmit],
  );

  return (
    <Container
      title={intl.formatMessage({ defaultMessage: '付款確認', id: 'lj1YNw' })}
      visible={open}
      content={
        <div className="flex flex-col text-black  ">
          <span className="text-sm">
            {intl.formatMessage({ defaultMessage: '請確認您已向賣家付款', id: 'bKoTT3' })}
          </span>
          <span className="mt-2 text-[#6175AE] text-xs">
            {intl.formatMessage({ defaultMessage: '惡意點擊將直接凍結賬戶', id: 'cQiVhL' })}
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
