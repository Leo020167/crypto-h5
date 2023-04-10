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
    <Container className="h-full bg-[#F0F1F7]">
      <NavBar onBack={() => history.goBack()} className="mb-8 bg-white">
        {intl.formatMessage({ defaultMessage: '安全驗證', id: 'yzF0zK' })}
      </NavBar>

      <div className="p-4">
        <div className="mb-8 text-center text-base text-[#898a8e]">
          {intl.formatMessage({ defaultMessage: '爲了保證你的賬號安全，請驗證身份', id: 'cbYoMn' })}
        </div>

        <div className="mb-8 text-center text-base font-bold">{userInfo?.email}</div>

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
    background-color: #fe6b1d;
    color: #fff;
  }
`;
export default EmailAuth;
