import { NavBar, Steps, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from '../../stores/auth';
import AccountStep1 from './AccountStep1';
import AccountStep2 from './AccountStep2';

const Account = () => {
  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);

  const [oldSmsCode, setOldSmsCode] = useState<string>('');

  const authStore = useAuthStore();

  const content = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <AccountStep2
            oldSmsCode={oldSmsCode}
            onStepCompleted={() => {
              setCurrent(2);
              authStore.logout();
              Toast.show('請重新登錄');
              history.replace('/login');
            }}
          />
        );
      default:
        return (
          <AccountStep1
            onStepCompleted={(smsCode) => {
              setOldSmsCode(smsCode);
              setCurrent(1);
            }}
          />
        );
    }
  }, [authStore, current, history, oldSmsCode]);

  return (
    <Container className="h-screen bg-white">
      <NavBar onBack={() => history.goBack()} className="mb-2">
        更换手机号码
      </NavBar>

      <Steps current={current}>
        <Steps.Step title="验证身份" />
        <Steps.Step title="更改手机号" />
        <Steps.Step title="完成" />
      </Steps>

      <div className="px-4">{content}</div>
    </Container>
  );
};

const Container = styled.div``;

export default Account;
