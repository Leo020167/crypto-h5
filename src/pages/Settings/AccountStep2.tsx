import { Button, Form, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import styled from 'styled-components';
import { userAtom } from '../../atoms';
import CountryPhoneNumber from '../../components/CountryPhoneNumber';
import SmsCodeInput from '../../components/SmsCodeInput';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { Country } from '../../model';
import { changePhoneTwo } from '../../utils/api';

interface AccountStepProps {
  oldSmsCode: string;
  onStepCompleted: () => void;
}
const AccountStep2 = ({ oldSmsCode, onStepCompleted }: AccountStepProps) => {
  const [openChangePhoneVerity, setOpenChangePhoneVerity] = useState(false);
  const [smsCode, setSmsCode] = useState<string>('');

  const user = useAtomValue(userAtom);

  const [country, setCountry] = useState<Country>({ code: '+852', name: '香港' });

  const [phone, setPhone] = useState<string>('');

  return (
    <Container>
      <Form
        onFinish={() => {
          if (!smsCode || !smsCode.trim().length) {
            Toast.show('请输入验证码');
            return;
          }

          setOpenChangePhoneVerity(true);
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
          <CountryPhoneNumber
            country={country}
            onCountryChange={setCountry}
            value={phone}
            onChange={setPhone}
            placeholder="请输入新手机号码"
          />
        </Form.Item>

        <Form.Item>
          <SmsCodeInput
            phoneNumber={phone}
            countryCode={country.code}
            value={smsCode}
            onChange={setSmsCode}
            placeholder="请输入验证码"
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
            oldPhone: user?.phone ?? '',
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
