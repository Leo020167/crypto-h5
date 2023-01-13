import { NavBar, Steps, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSetPayPass } from '../../api/endpoints/transformer';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { useAuthStore } from '../../stores/auth';
import AccountStep2 from './AccountStep2';
import AccountStep3 from './AccountStep3';

const SettingPayPassword = () => {
  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);

  const intl = useIntl();

  const [payPass, setPayPass] = useState<string>('');
  const [configPayPass, setConfigPayPass] = useState<string>('');

  const [visible, setVisible] = useState(false);

  const content = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <AccountStep3
            onStepCompleted={(configPayPass) => {
              setConfigPayPass(configPayPass);
              setVisible(true);
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
  }, [current]);

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

      <SwipeImageValidator
        open={visible}
        onClose={() => setVisible(false)}
        onSuccess={(locationx, dragImgKey) => {
          setPayPassMutation.mutate({
            data: {
              oldPhone: auth.userInfo?.phone,
              dragImgKey,
              locationx,
              payPass,
              configPayPass,
            },
          });
        }}
      />
    </Container>
  );
};

const Container = styled.div``;

export default SettingPayPassword;
