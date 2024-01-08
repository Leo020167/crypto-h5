import { Tabs } from 'antd-mobile';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useSignUpStore } from '../stores/signup';

export const RegisterTabs = () => {
  const intl = useIntl();
  const { value, setValue } = useSignUpStore();
  return (
    <Container
      className="bg-white dark:bg-[#2a2e38]"
      defaultActiveKey="1"
      onChange={(key) => setValue({ ...value, type: Number(key) as 1 | 2 })}
    >
      <Tabs.Tab title={intl.formatMessage({ defaultMessage: '手机注册', id: 'dfT5lg' })} key="1" />
      <Tabs.Tab
        title={intl.formatMessage({
          defaultMessage: '邮箱注册',
          id: 'eMnHfD',
        })}
        key="2"
      />
    </Container>
  );
};

const Container = styled(Tabs)`
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  .adm-tabs-header {
    border-bottom: 0;
  }
  box-shadow: none;
`;
