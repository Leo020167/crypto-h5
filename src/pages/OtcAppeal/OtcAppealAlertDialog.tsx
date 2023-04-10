import { Modal } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

interface OtcAppealAlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const OtcAppealAlertDialog = ({ open, onClose, onSubmit }: OtcAppealAlertDialogProps) => {
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
        text: intl.formatMessage({ defaultMessage: '申訴', id: 'qSm4kD' }),
        onClick: onSubmit,
      },
    ],
    [intl, onClose, onSubmit],
  );

  return (
    <Container
      title={intl.formatMessage({ defaultMessage: '申訴提醒', id: '/+9l+X' })}
      visible={open}
      content={
        <div className="flex flex-col text-black  ">
          <span className="text-sm">
            {intl.formatMessage({
              defaultMessage:
                '提起申訴後資產將會凍結，申訴專員將介入本次交易，直至申訴結束。惡意申訴屬於擾亂平台正常運營秩序的行為，情節嚴重將凍結賬戶。',
              id: '/nvKfb',
            })}
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
      font-weight: 400;
      font-size: 14px;
      text-align: left;
    }
  }
`;

export default OtcAppealAlertDialog;
