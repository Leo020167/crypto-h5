import { Button, Form, Modal, Toast } from 'antd-mobile';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useUserSecurityCheckIdentity } from '../../api/endpoints/transformer';
import SmsCodeInput from '../../components/SmsCodeInput';
import { useAuthStore } from '../../stores/auth';

interface AccountStepProps {
  onStepCompleted: (smsCode: string) => void;
}
const AccountStep1 = ({ onStepCompleted }: AccountStepProps) => {
  const [smsCode, setSmsCode] = useState<string>('');

  const { userInfo } = useAuthStore();

  const intl = useIntl();

  const userSecurityCheckIdentity = useUserSecurityCheckIdentity({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          onStepCompleted(smsCode);
        } else {
          Toast.show(data.msg);
        }
      },
    },
  });

  const phoneNumber = useMemo(() => {
    if (userInfo?.phone) {
      return userInfo?.phone?.substring(0, 3) + '****' + userInfo?.phone?.substring(7);
    }
    return '';
  }, [userInfo?.phone]);

  const history = useHistory();

  const mounted = useRef(false);
  useEffect(() => {
    if (!phoneNumber && !mounted.current) {
      mounted.current = true;
      Modal.confirm({
        className: 'phone-bind-alert',
        title: intl.formatMessage({ defaultMessage: '提示', id: 'kCh5Jz' }),
        content: intl.formatMessage({ defaultMessage: '未綁定手機', id: '5OrGa0' }),
        confirmText: intl.formatMessage({ defaultMessage: '去绑定', id: 'UdsGuw' }),
        onConfirm() {
          history.push({ pathname: '/account' });
        },
        onClose() {
          history.goBack();
        },
      });
    }
  }, [history, intl, phoneNumber]);

  return (
    <Container>
      <div className="border-b p-4">
        {intl.formatMessage({ defaultMessage: '已綁定手機號：', id: 'EGAOia' })}
        {phoneNumber}
      </div>
      <Form
        onFinish={() => {
          userSecurityCheckIdentity.mutate({
            data: {
              phone: userInfo?.phone ?? '',
              smsCode,
              dragImgKey: '',
              locationx: 0,
            },
          });
        }}
        footer={
          <div>
            <Button color="primary" type="submit" size="large" block>
              {intl.formatMessage({ defaultMessage: '下一步', id: '6Y0p2/' })}
            </Button>
          </div>
        }
      >
        <Form.Item>
          <SmsCodeInput
            phoneNumber={userInfo?.phone ?? ''}
            countryCode={userInfo?.countryCode ?? ''}
            value={smsCode}
            onChange={setSmsCode}
            placeholder={intl.formatMessage({ defaultMessage: '请输入验证码', id: '9UZxwP' })}
          />
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div``;

export default AccountStep1;
