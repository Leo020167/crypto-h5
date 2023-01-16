import { Button, Form, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import SmsCodeInput from '../../components/SmsCodeInput';
import { useAuthStore } from '../../stores/auth';
import { checkIdentity } from '../../utils/api';

interface AccountStepProps {
  onStepCompleted: (smsCode: string) => void;
}
const AccountStep1 = ({ onStepCompleted }: AccountStepProps) => {
  const [smsCode, setSmsCode] = useState<string>('');

  const { userInfo } = useAuthStore();

  const intl = useIntl();

  return (
    <div>
      <div className="border-b p-4">
        {intl.formatMessage({ defaultMessage: '已绑定手机号：', id: 'yz8Bd8' })}
        {userInfo?.phone}
      </div>
      <Form
        onFinish={() => {
          checkIdentity({
            phone: userInfo?.phone ?? '',
            smsCode,
            dragImgKey: '',
            locationx: 0,
          }).then((res) => {
            if (res.code === '200') {
              onStepCompleted(smsCode);
            } else {
              Toast.show(res.msg);
            }
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
    </div>
  );
};

export default AccountStep1;
