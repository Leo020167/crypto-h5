import { Button, Form, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { useUserSecurityUpdatePhone } from '../../api/endpoints/transformer';
import CountryPhoneNumber from '../../components/CountryPhoneNumber';
import Screen from '../../components/Screen';
import SmsCodeInput from '../../components/SmsCodeInput';
import useCountry from '../../hooks/useCountry';
import { useAuthStore } from '../../stores/auth';

const typeParam = withDefault(NumberParam, 1);
const BindPhone = () => {
  const intl = useIntl();

  const [phone, setPhone] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [country, setCountry] = useCountry();
  const [type] = useQueryParam('type', typeParam);

  const authStore = useAuthStore();

  const history = useHistory();
  const userSecurityUpdatePhone = useUserSecurityUpdatePhone({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          authStore.bindPhone(phone);

          Toast.show(data.msg);
          if (type === 1) {
            history.replace('/settings');
            return;
          }

          if (type === 2) {
            // 充幣界面
            history.replace('/take-coin');
            return;
          }
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
        countryCode: country.code,
      },
    });
  }, [country.code, intl, phone, smsCode, userSecurityUpdatePhone]);

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '请输入手机号码', id: 'ejs0A3' })}>
      <Container className="p-4">
        <Form>
          <Form.Item>
            <CountryPhoneNumber
              country={country}
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
          <div className="mt-8">
            <Button
              block
              className="submit"
              onClick={handleFinish}
              loading={userSecurityUpdatePhone.isLoading}
            >
              {intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' })}
            </Button>
          </div>
        </Form>
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .submit {
    background-color: #ff6b1b;
    color: #fff;
  }
`;

export default BindPhone;
