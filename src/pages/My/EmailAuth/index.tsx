import { Button, NavBar } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { stringify } from 'qs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { userAtom } from '../../../atoms';

const EmailAuth = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const user = useAtomValue(userAtom);

  const mode = Number(searchParams.get('mode') ?? 0);

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar onBack={() => navigate(-1)} className="bg-white mb-8">
        安全验证
      </NavBar>

      <div className="p-4">
        <div className="text-center text-[#898a8e] text-base mb-8">
          为了保证你的账号安全，请验证身份
        </div>

        <div className="text-center text-base font-bold mb-8">{user?.email}</div>

        <Button
          block
          size="large"
          className="submit"
          onClick={() => {
            if (user?.email) {
              navigate(`/email-auth-code?${stringify({ mode, email: user?.email })}`);
            }
          }}
        >
          发送验证码
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .submit {
    color: #fff;
    background-color: #fe6b1d;
  }
`;
export default EmailAuth;
