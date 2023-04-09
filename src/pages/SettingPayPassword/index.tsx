import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSetPayPass } from '../../api/endpoints/transformer';
import { SetPayPassBody } from '../../api/model';
import { useAuthStore } from '../../stores/auth';

const SettingPayPassword = () => {
  const history = useHistory();

  const intl = useIntl();

  const auth = useAuthStore();
  const setPayPassMutation = useSetPayPass({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          auth.getUserInfo();
          Toast.show(data.msg);
          history.replace({ pathname: '/settings' });
        }
      },
    },
  });

  const onFinish = (values: SetPayPassBody) => {
    setPayPassMutation.mutate({
      data: values,
    });
  };

  return (
    <Container className="h-screen bg-white">
      <NavBar onBack={() => history.goBack()} className="mb-2">
        {auth.userInfo?.payPass
          ? intl.formatMessage({ defaultMessage: '修改交易密碼', id: 'nAaIBd' })
          : intl.formatMessage({ defaultMessage: '設置交易密碼', id: 'obugXD' })}
      </NavBar>

      <div className="px-4">
        <Form
          onFinish={onFinish}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={setPayPassMutation.isLoading}
            >
              提交
            </Button>
          }
        >
          {!!auth.userInfo?.payPass && (
            <Form.Item
              name="oldPayPass"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ defaultMessage: '請輸入原密碼', id: 'srNPrw' }),
                },
              ]}
            >
              <Input
                type="password"
                placeholder={intl.formatMessage({
                  defaultMessage: '請輸入原密碼',
                  id: 'srNPrw',
                })}
              />
            </Form.Item>
          )}

          <Form.Item
            name="payPass"
            rules={[
              {
                required: true,
                len: 6,
                message: intl.formatMessage({ defaultMessage: '請輸入6位支付密碼', id: 'k/3udR' }),
              },
            ]}
          >
            <Input
              type="password"
              placeholder={intl.formatMessage({
                defaultMessage: '請輸入新密碼',
                id: 'rZ0rJT',
              })}
            />
          </Form.Item>
          <Form.Item
            name="configPayPass"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ defaultMessage: '請輸入確認密碼', id: 'gYHc6L' }),
              },
              (form) => ({
                validator: async (rule, value) => {
                  const payPass = form.getFieldValue('payPass');
                  const val = value.trim?.();
                  if (val.length > 0 && val !== payPass) {
                    throw new Error(
                      intl.formatMessage({
                        defaultMessage: '兩次密碼輸入不一致',
                        id: '3VZKdc',
                      }),
                    );
                  }
                },
              }),
            ]}
          >
            <Input
              type="password"
              placeholder={intl.formatMessage({
                defaultMessage: '確認新密碼',
                id: 'VbE2gD',
              })}
            />
          </Form.Item>
        </Form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-list-item-description {
    padding: 0 1rem;
  }
`;

export default SettingPayPassword;
