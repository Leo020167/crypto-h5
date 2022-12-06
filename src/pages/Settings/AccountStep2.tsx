import { Button, Form, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import CountryPhoneNumber from '../../components/CountryPhoneNumber';
import SmsCodeInput from '../../components/SmsCodeInput';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { Country } from '../../model';
import { useAuthStore } from '../../stores/auth';
import { changePhoneTwo } from '../../utils/api';

interface AccountStepProps {
  oldSmsCode: string;
  onStepCompleted: () => void;
}
const AccountStep2 = ({ oldSmsCode, onStepCompleted }: AccountStepProps) => {
  const [openChangePhoneVerity, setOpenChangePhoneVerity] = useState(false);
  const [smsCode, setSmsCode] = useState<string>('');

  const { userInfo } = useAuthStore();

  const [country, setCountry] = useState<Country>({ code: '+852', name: '香港' });

  const [phone, setPhone] = useState<string>('');

  const intl = useIntl();

  return (
    <Container>
      <Form
        onFinish={() => {
          if (!smsCode || !smsCode.trim().length) {
            Toast.show(intl.formatMessage({ defaultMessage: '请输入验证码', id: '9UZxwP' }));
            return;
          }

          setOpenChangePhoneVerity(true);
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

      <SwipeImageValidator
        open={openChangePhoneVerity}
        onClose={() => setOpenChangePhoneVerity(false)}
        onSuccess={(locationx, dragImgKey) => {
          changePhoneTwo({
            dragImgKey,
            locationx,
            newCountryCode: country.code,
            newPhone: phone,
            newSmsCode: smsCode,
            oldPhone: userInfo?.phone ?? '',
            oldSmsCode,
          }).then((res) => {
            if (res.code === '200') {
              onStepCompleted();
              setOpenChangePhoneVerity(false);
            }
          });
        }}
      />
    </Container>
  );
};

const Container = styled.div``;

export default AccountStep2;
