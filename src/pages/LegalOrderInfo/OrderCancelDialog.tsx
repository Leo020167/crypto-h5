import { Modal, Radio } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

interface OrderCancelDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const OrderCancelDialog = ({ open, onClose, onSubmit }: OrderCancelDialogProps) => {
  const intl = useIntl();

  const actions = useMemo(
    () => [
      {
        key: 'cancel',
        text: intl.formatMessage({ defaultMessage: '我再想想', id: 'KF8CBJ' }),
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
      title={intl.formatMessage({ defaultMessage: '確認取消訂單', id: 'ZbI0hT' })}
      visible={open}
      content={
        <div className="flex flex-col text-xs text-[#6175AE]">
          <span>
            {intl.formatMessage({
              defaultMessage: '如您已經向賣家付款，請不要取消訂單',
              id: '3tf3AE',
            })}
          </span>
          <span className="text-black mt-1">
            {intl.formatMessage({
              defaultMessage: '取消規則：買家當日累計4筆取消， 會限制當日買入功能。',
              id: '7WxsZY',
            })}
          </span>
          <Radio className="mt-2">
            {intl.formatMessage({
              defaultMessage: '我確認還沒有付款給對方',
              id: 'f2BEYr',
            })}
          </Radio>
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
