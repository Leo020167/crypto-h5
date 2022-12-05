import { Modal, PasscodeInput } from 'antd-mobile';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface PaymentPasswordDialogProps {
  open?: boolean;
  onClose?: () => void;
  onFill?: (val: string) => void;
}
const PaymentPasswordDialog = ({ open, onClose, onFill }: PaymentPasswordDialogProps) => {
  return (
    <Container
      visible={open}
      onClose={onClose}
      title="请输入交易密码"
      closeOnMaskClick
      destroyOnClose
      content={
        <div className="pt-4 flex flex-col">
          <div className="flex justify-center">
            <PasscodeInput onFill={onFill} />
          </div>

          <div className="pl-2 mt-4">
            <Link to="" className="text-[#6175AE] text-sm">
              交易密码管理
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
