import { Steps, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
import AccountStep1 from './AccountStep1';
import AccountStep2 from './AccountStep2';

const Account = () => {
  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);

  const [oldSmsCode, setOldSmsCode] = useState<string>('');

  const authStore = useAuthStore();

  const intl = useIntl();

  const content = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <AccountStep2
            oldSmsCode={oldSmsCode}
            onStepCompleted={() => {
              setCurrent(2);
              authStore.logout();
              Toast.show(intl.formatMessage({ defaultMessage: '請重新登錄', id: 'z8a9KR' }));
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
  }, [authStore, current, history, intl, oldSmsCode]);

  return (
    <Screen
      className="h-screen bg-white"
      navBarProps={{ onBack: () => history.goBack() }}
      headerTitle={intl.formatMessage({ defaultMessage: '更换手机号码', id: '2Y1clI' })}
    >
      <Steps current={current}>
        <Steps.Step title={intl.formatMessage({ defaultMessage: '验证身份', id: 'tI511i' })} />
        <Steps.Step title={intl.formatMessage({ defaultMessage: '更改手机号', id: 'iVpb9N' })} />
        <Steps.Step title={intl.formatMessage({ defaultMessage: '完成', id: 'uHUP9v' })} />
      </Steps>

      <div className="px-4">{content}</div>
    </Screen>
  );
};

export default Account;
