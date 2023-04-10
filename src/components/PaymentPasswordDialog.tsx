import { Modal, PasscodeInput } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from '../stores/auth';

interface PaymentPasswordDialogProps {
  open?: boolean;
  onClose?: () => void;
  onFill?: (val: string) => void;
}
const PaymentPasswordDialog = ({ open, onClose, onFill }: PaymentPasswordDialogProps) => {
  const intl = useIntl();

  const history = useHistory();
  const authStore = useAuthStore();
  return (
    <Container
      visible={open}
      onClose={onClose}
      title={intl.formatMessage({ defaultMessage: '请输入交易密码', id: 'Qyvn9e' })}
      closeOnMaskClick
      destroyOnClose
      content={
        <div className="flex flex-col pt-4">
          <div className="flex justify-center">
            <PasscodeInput onFill={onFill} />
          </div>

          <div className="mt-4 pl-2">
            <a
              onClick={() => {
                if (authStore.userInfo?.phone) {
                  history.push('/setting-pay-password');
                } else {
                  history.push('/bind-phone');
                }
              }}
              className="text-sm text-[#6175AE]"
            >
              {intl.formatMessage({ defaultMessage: '交易密码管理', id: 'lK7IeZ' })}
            </a>
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
