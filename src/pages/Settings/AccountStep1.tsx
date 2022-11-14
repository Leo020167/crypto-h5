import { Button, Form, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { userAtom } from '../../atoms';
import SmsCodeInput from '../../components/SmsCodeInput';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { checkIdentity, getSms } from '../../utils/api';

interface AccountStepProps {
  onStepCompleted: (smsCode: string) => void;
}
const AccountStep1 = ({ onStepCompleted }: AccountStepProps) => {
  const [open, setOpen] = useState(false);
  const [openSmsCodeVerity, setOpenSmsCodeVerity] = useState(false);
  const [smsCode, setSmsCode] = useState<string>('');

  const user = useAtomValue(userAtom);

  return (
    <div>
      <div className="border-b p-4">已绑定手机号：{user?.phone}</div>
      <Form
        onFinish={() => {
          setOpenSmsCodeVerity(true);
        }}
        footer={
          <div>
            <Button color="primary" type="submit" size="large" block>
              下一步
            </Button>
          </div>
        }
      >
        <Form.Item>
          <SmsCodeInput
            phoneNumber={user?.phone ?? ''}
            countryCode={user?.countryCode ?? ''}
            value={smsCode}
            onChange={setSmsCode}
            placeholder="请输入验证码"
          />
        </Form.Item>
      </Form>

      <SwipeImageValidator
        open={openSmsCodeVerity}
        onClose={() => setOpenSmsCodeVerity(false)}
        onSuccess={(locationx, dragImgKey) => {
          checkIdentity({
            phone: user?.phone ?? '',
            smsCode,
            dragImgKey,
            locationx,
          }).then((res) => {
            if (res.code === '200') {
              setOpenSmsCodeVerity(false);
              onStepCompleted(smsCode);
            }
          });
        }}
      />

      <SwipeImageValidator
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(positionX, dragImgKey) => {
          getSms({
            countryCode: user?.countryCode ?? '',
            dragImgKey: dragImgKey,
            locationx: positionX,
            sendAddr: user?.phone ?? '',
            type: 1,
          }).then((res) => {
            if (res.code !== '200') {
              Toast.show(res.msg);
            }
          });

          if (user?.phone) {
            const phone = user.phone.substring(0, 3) + '****' + user.phone.substring(7);
            Toast.show(`短信验证码已经发送至${phone}`);
          }

          setOpen(false);
        }}
      />
    </div>
  );
};

export default AccountStep1;
