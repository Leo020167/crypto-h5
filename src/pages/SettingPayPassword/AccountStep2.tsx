import { Button, Form, PasscodeInput } from 'antd-mobile';
import md5 from 'js-md5';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

interface AccountStepProps {
  onStepCompleted: (payPass: string) => void;
}
const AccountStep2 = ({ onStepCompleted }: AccountStepProps) => {
  const intl = useIntl();

  const [payPass, setPayPass] = useState<string>('');
  const [disabled, setDisabled] = useState(true);

  return (
    <Container>
      <Form
        onFinish={() => {
          onStepCompleted(md5(payPass));
        }}
        footer={
          <div>
            <Button color="primary" type="submit" size="large" block disabled={disabled}>
              {intl.formatMessage({ defaultMessage: '下一步', id: '6Y0p2/' })}
            </Button>
          </div>
        }
      >
        <div className=" mb-5 mt-8 text-center text-sm text-[#232323]">
          {intl.formatMessage({ defaultMessage: '請輸入6位支付密碼', id: 'k/3udR' })}
        </div>
        <Form.Item>
          <div className="flex justify-center">
            <PasscodeInput
              onFill={(val) => {
                setPayPass(val);
                setDisabled(false);
              }}
            />
          </div>
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div``;

export default AccountStep2;
