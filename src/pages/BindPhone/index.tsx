import { Button, Form, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserSecurityUpdatePhone } from '../../api/endpoints/transformer';
import CountryPhoneNumber from '../../components/CountryPhoneNumber';
import Screen from '../../components/Screen';
import SmsCodeInput from '../../components/SmsCodeInput';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { Country } from '../../model';

const BindPhone = () => {
  const [phone, setPhone] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [country, setCountry] = useState<Country>({ code: '+852', name: '香港' });

  const navigate = useNavigate();
  const userSecurityUpdatePhone = useUserSecurityUpdatePhone({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          navigate('/take-coin', { replace: true });
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!phone || !phone.trim().length) {
      Toast.show('請輸入手機號碼');
      return;
    }
    if (!smsCode || !smsCode.trim().length) {
      Toast.show('請輸入驗證碼');
      return;
    }

    userSecurityUpdatePhone.mutate({
      data: {
        phone,
        code: smsCode,
      },
    });
  }, [phone, smsCode, userSecurityUpdatePhone]);

  const [open, setOpen] = useState(false);

  return (
    <Screen headerTitle="请输入手机号码">
      <div className="p-4">
        <Form>
          <Form.Item>
            <CountryPhoneNumber
              placeholder="请输入手机号码"
              value={phone}
              onChange={setPhone}
              onCountryChange={setCountry}
            />
          </Form.Item>
          <Form.Item>
            <SmsCodeInput
              phoneNumber={phone}
              countryCode={country.code}
              placeholder="请输入验证码"
              value={smsCode}
              onChange={setSmsCode}
            />
          </Form.Item>
          <ButtonWrapper block className="mt-8" onClick={() => setOpen(true)}>
            确定
          </ButtonWrapper>
        </Form>
      </div>

      <SwipeImageValidator open={open} onClose={() => setOpen(false)} onSuccess={handleFinish} />
    </Screen>
  );
};

const ButtonWrapper = styled(Button)`
  background-color: #ff6b1b;
  color: #fff;
`;

export default BindPhone;
