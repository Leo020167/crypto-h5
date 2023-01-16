import { NavBar, Steps, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSetPayPass } from '../../api/endpoints/transformer';
import { useAuthStore } from '../../stores/auth';
import AccountStep2 from './AccountStep2';
import AccountStep3 from './AccountStep3';

const SettingPayPassword = () => {
  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);

  const intl = useIntl();

  const [payPass, setPayPass] = useState<string>('');

  const auth = useAuthStore();
  const setPayPassMutation = useSetPayPass({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.replace({ pathname: '/settings' });
        }
      },
    },
  });
  const content = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <AccountStep3
            onStepCompleted={(configPayPass) => {
              setPayPassMutation.mutate({
                data: {
                  oldPhone: auth.userInfo?.phone,
                  payPass,
                  configPayPass,
                },
              });
            }}
          />
        );
      default:
        return (
          <AccountStep2
            onStepCompleted={(payPass) => {
              setPayPass(payPass);
              setCurrent(1);
            }}
          />
        );
    }
  }, [auth.userInfo?.phone, current, payPass, setPayPassMutation]);

  return (
    <Container className="h-screen bg-white">
      <NavBar onBack={() => history.goBack()} className="mb-2">
        {auth.userInfo?.payPass
          ? intl.formatMessage({ defaultMessage: '修改交易密碼', id: 'nAaIBd' })
          : intl.formatMessage({ defaultMessage: '設置交易密碼', id: 'obugXD' })}
      </NavBar>

      <Steps current={current}>
        <Steps.Step title={intl.formatMessage({ defaultMessage: '設置密碼', id: 'Ks5Olr' })} />
        <Steps.Step title={intl.formatMessage({ defaultMessage: '確認密碼', id: 'NBRkJQ' })} />
      </Steps>

      <div className="px-4">{content}</div>
    </Container>
  );
};

const Container = styled.div``;

export default SettingPayPassword;
