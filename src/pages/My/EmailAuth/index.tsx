import { Button, NavBar } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useQueryParam } from 'use-query-params';
import { useAuthStore } from '../../../stores/auth';

import { ModeParam } from '../../../utils/params';

const EmailAuth = () => {
  const [mode] = useQueryParam('mode', ModeParam);

  const history = useHistory();

  const { userInfo } = useAuthStore();

  const intl = useIntl();

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar onBack={() => history.goBack()} className="bg-white mb-8">
        {intl.formatMessage({ defaultMessage: '安全驗證', id: 'yzF0zK' })}
      </NavBar>

      <div className="p-4">
        <div className="text-center text-[#898a8e] text-base mb-8">
          {intl.formatMessage({ defaultMessage: '爲了保證你的賬號安全，請驗證身份', id: 'cbYoMn' })}
        </div>

        <div className="text-center text-base font-bold mb-8">{userInfo?.email}</div>

        <Button
          block
          size="large"
          className="submit"
          onClick={() => {
            if (userInfo?.email) {
              history.push(`/email-auth-code?${stringify({ mode, email: userInfo?.email })}`);
            }
          }}
        >
          {intl.formatMessage({ defaultMessage: '發送驗證碼', id: 'MYqUqI' })}
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
