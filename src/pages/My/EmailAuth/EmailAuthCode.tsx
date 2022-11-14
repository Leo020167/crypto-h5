import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import qs from 'qs';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { checkEmailCode, getEmail } from '../../../utils/api';

const EmailAuthCode = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const mode = Number(searchParams.get('mode') ?? 0);
  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const mounted = useRef<boolean>(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    getEmail(email);
  }, [email]);

  const handleFinish = useCallback(
    (values: { code?: string }) => {
      if (!values.code || !values.code.trim().length) {
        Toast.show('請輸入郵箱驗證碼');
        return;
      }

      checkEmailCode({ code: values.code, email }).then((res) => {
        if (res.code === '200') {
          if (mode === 1) {
            navigate(`/bind-email?${qs.stringify({ email })}`);
          } else {
            Toast.show('验证成功');
            navigate(-1);
          }
        }
      });
    },
    [email, mode, navigate],
  );

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar onBack={() => navigate(-1)} className="bg-white mb-8">
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
