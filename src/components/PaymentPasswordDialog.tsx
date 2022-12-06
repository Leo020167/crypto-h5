import { Modal, PasscodeInput } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface PaymentPasswordDialogProps {
  open?: boolean;
  onClose?: () => void;
  onFill?: (val: string) => void;
}
const PaymentPasswordDialog = ({ open, onClose, onFill }: PaymentPasswordDialogProps) => {
  const intl = useIntl();
  return (
    <Container
      visible={open}
      onClose={onClose}
      title={intl.formatMessage({ defaultMessage: '请输入交易密码', id: 'Qyvn9e' })}
      closeOnMaskClick
      destroyOnClose
      content={
        <div className="pt-4 flex flex-col">
          <div className="flex justify-center">
            <PasscodeInput onFill={onFill} />
          </div>

          <div className="pl-2 mt-4">
            <Link to="" className="text-[#6175AE] text-sm">
              {intl.formatMessage({ defaultMessage: '交易密码管理', id: 'lK7IeZ' })}
            </Link>
          </div>
        </div>
      }
    />
  );
};

const Container = styled(Modal)`
  .adm-modal-content {
    height: auto;
  }
`;

export default PaymentPasswordDialog;
