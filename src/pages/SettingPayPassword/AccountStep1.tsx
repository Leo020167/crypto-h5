import { Button, Form, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import SmsCodeInput from '../../components/SmsCodeInput';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { useAuthStore } from '../../stores/auth';
import { checkIdentity, getSms } from '../../utils/api';

interface AccountStepProps {
  onStepCompleted: (smsCode: string) => void;
}
const AccountStep1 = ({ onStepCompleted }: AccountStepProps) => {
  const [open, setOpen] = useState(false);
  const [openSmsCodeVerity, setOpenSmsCodeVerity] = useState(false);
  const [smsCode, setSmsCode] = useState<string>('');

  const { userInfo } = useAuthStore();

  const intl = useIntl();

  return (
    <div>
      <div className="border-b p-4">
        {intl.formatMessage({ defaultMessage: '已綁定手機號：', id: 'EGAOia' })}
        {userInfo?.phone?.substring(0, 3) + '****' + userInfo?.phone?.substring(7)}
      </div>
      <Form
        onFinish={() => {
          setOpenSmsCodeVerity(true);
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

      <SwipeImageValidator
        open={openSmsCodeVerity}
        onClose={() => setOpenSmsCodeVerity(false)}
        onSuccess={(locationx, dragImgKey) => {
          checkIdentity({
            phone: userInfo?.phone ?? '',
            smsCode,
            dragImgKey,
            locationx,
          }).then((res) => {
            setOpenSmsCodeVerity(false);

            if (res.code === '200') {
              onStepCompleted(smsCode);
            } else {
              Toast.show(res.msg);
            }
          });
        }}
      />

      <SwipeImageValidator
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(positionX, dragImgKey) => {
          getSms({
            countryCode: userInfo?.countryCode ?? '',
            dragImgKey: dragImgKey,
            locationx: positionX,
            sendAddr: userInfo?.phone ?? '',
            type: 1,
          }).then((res) => {
            if (res.code !== '200') {
              Toast.show(res.msg);
            }
          });

          if (userInfo?.phone) {
            const phone = userInfo.phone.substring(0, 3) + '****' + userInfo.phone.substring(7);
            Toast.show(
              intl.formatMessage(
                { defaultMessage: '短信验证码已经发送至{phone}', id: 'YcfcO0' },
                { phone },
              ),
            );
          }

          setOpen(false);
        }}
      />
    </div>
  );
};

export default AccountStep1;
