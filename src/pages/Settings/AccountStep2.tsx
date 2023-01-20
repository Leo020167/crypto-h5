import { Button, Form, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useChangePhoneTwo } from '../../api/endpoints/transformer';

import CountryPhoneNumber from '../../components/CountryPhoneNumber';
import SmsCodeInput from '../../components/SmsCodeInput';
import useCountry from '../../hooks/useCountry';
import { useAuthStore } from '../../stores/auth';

interface AccountStepProps {
  oldSmsCode: string;
  onStepCompleted: () => void;
}
const AccountStep2 = ({ oldSmsCode, onStepCompleted }: AccountStepProps) => {
  const [smsCode, setSmsCode] = useState<string>('');

  const [country, setCountry] = useCountry();

  const [phone, setPhone] = useState<string>('');

  const intl = useIntl();

  const { userInfo } = useAuthStore();

  const changePhoneTwo = useChangePhoneTwo({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          onStepCompleted();
        }
      },
    },
  });

  return (
    <Container>
      <Form
        onFinish={() => {
          if (!smsCode || !smsCode.trim().length) {
            Toast.show(intl.formatMessage({ defaultMessage: '请输入验证码', id: '9UZxwP' }));
            return;
          }
          changePhoneTwo.mutate({
            data: {
              newCountryCode: country.code,
              newPhone: phone,
              newSmsCode: smsCode,
              oldPhone: userInfo?.phone ?? '',
              oldSmsCode,
            },
          });
        }}
        footer={
          <div>
            <Button
              color="primary"
              type="submit"
              size="large"
              block
              loading={changePhoneTwo.isLoading}
            >
              {intl.formatMessage({ defaultMessage: '下一步', id: '6Y0p2/' })}
            </Button>
          </div>
        }
      >
        <Form.Item>
          <CountryPhoneNumber
            country={country}
            onCountryChange={setCountry}
            value={phone}
            onChange={setPhone}
            placeholder={intl.formatMessage({ defaultMessage: '请输入新手机号码', id: 'Uamdul' })}
          />
        </Form.Item>

        <Form.Item>
          <SmsCodeInput
            phoneNumber={phone}
            countryCode={country.code}
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

export default AccountStep2;
