import { Button, Form, PasscodeInput } from 'antd-mobile';
import md5 from 'js-md5';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

interface AccountStepProps {
  loading: boolean;
  onStepCompleted: (configPayPass: string) => void;
}
const AccountStep3 = ({ loading, onStepCompleted }: AccountStepProps) => {
  const intl = useIntl();

  const [configPayPass, setConfigPayPass] = useState<string>('');
  const [disabled, setDisabled] = useState(true);

  return (
    <Container>
      <Form
        onFinish={() => {
          onStepCompleted(md5(configPayPass));
        }}
        footer={
          <div>
            <Button
              color="primary"
              type="submit"
              size="large"
              block
              disabled={disabled}
              loading={loading}
            >
              {intl.formatMessage({ defaultMessage: '完成', id: 'uHUP9v' })}
            </Button>
          </div>
        }
      >
        <div className=" mt-8 mb-5 text-sm text-[#232323] text-center">
          {intl.formatMessage({ defaultMessage: '請再次輸入6位支付密碼', id: '4kxY/u' })}
        </div>
        <Form.Item>
          <div className="flex justify-center">
            <PasscodeInput
              onFill={(val) => {
                setConfigPayPass(val);
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

export default AccountStep3;
