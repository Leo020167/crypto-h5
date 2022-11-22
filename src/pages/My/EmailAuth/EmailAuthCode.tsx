import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import qs from 'qs';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { checkEmailCode, getEmail } from '../../../utils/api';

const ModeParam = withDefault(NumberParam, 0);
const EmailAuthCode = () => {
  const history = useHistory();

  const [mode] = useQueryParam('mode', ModeParam);
  const [email] = useQueryParam('email', StringParam);

  const mounted = useRef<boolean>(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    getEmail(email ?? '');
  }, [email]);

  const handleFinish = useCallback(
    (values: { code?: string }) => {
      if (!values.code || !values.code.trim().length) {
        Toast.show('請輸入郵箱驗證碼');
        return;
      }

      checkEmailCode({ code: values.code, email: email ?? '' }).then((res) => {
        if (res.code === '200') {
          if (mode === 1) {
            history.push(`/bind-email?${qs.stringify({ email })}`);
          } else {
            Toast.show('验证成功');
            history.goBack();
          }
        }
      });
    },
    [email, history, mode],
  );

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar onBack={() => history.goBack()} className="bg-white mb-8">
        郵箱驗證碼
      </NavBar>

      <div className="text-center mb-4 text-[#78797d]">{`驗證碼已發送至，${email}`}</div>
      <Form
        onFinish={handleFinish}
        className="p-4"
        layout="vertical"
        footer={
          <div className="mt-4">
            <Button type="submit" block size="large" className="submit">
              发送验证码
            </Button>
          </div>
        }
      >
        <Form.Item name="code">
          <Input type="code" placeholder="请输入邮箱验证码" />
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  .submit {
    color: #fff;
    background-color: #fe6b1d;
  }
`;
export default EmailAuthCode;
