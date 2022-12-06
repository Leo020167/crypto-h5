import { Button, Form, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useUserSecurityUpdatePhone } from '../../api/endpoints/transformer';
import CountryPhoneNumber from '../../components/CountryPhoneNumber';
import Screen from '../../components/Screen';
import SmsCodeInput from '../../components/SmsCodeInput';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { Country } from '../../model';

const BindPhone = () => {
  const intl = useIntl();

  const [phone, setPhone] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [country, setCountry] = useState<Country>({ code: '+852', name: '香港' });

  const history = useHistory();
  const userSecurityUpdatePhone = useUserSecurityUpdatePhone({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.replace('/take-coin');
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!phone || !phone.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入手機號碼', id: 'EMjkQg' }));
      return;
    }
    if (!smsCode || !smsCode.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入驗證碼', id: 'Bzq9W2' }));
      return;
    }

    userSecurityUpdatePhone.mutate({
      data: {
        phone,
        code: smsCode,
      },
    });
  }, [intl, phone, smsCode, userSecurityUpdatePhone]);

  const [open, setOpen] = useState(false);

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '请输入手机号码', id: 'ejs0A3' })}>
      <div className="p-4">
        <Form>
          <Form.Item>
            <CountryPhoneNumber
              placeholder={intl.formatMessage({ defaultMessage: '请输入手机号码', id: 'ejs0A3' })}
              value={phone}
              onChange={setPhone}
              onCountryChange={setCountry}
            />
          </Form.Item>
          <Form.Item>
            <SmsCodeInput
              placeholder={intl.formatMessage({ defaultMessage: '请输入验证码', id: '9UZxwP' })}
              phoneNumber={phone}
              countryCode={country.code}
              value={smsCode}
              onChange={setSmsCode}
            />
          </Form.Item>
          <ButtonWrapper block className="mt-8" onClick={() => setOpen(true)}>
            {intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' })}
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
