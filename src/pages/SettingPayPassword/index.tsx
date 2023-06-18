import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import md5 from 'js-md5';
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
    const data: SetPayPassBody = {
      payPass: md5(values.payPass as string).toUpperCase(),
      configPayPass: md5(values.configPayPass as string).toUpperCase(),
    };

    if (values.oldPayPass) {
      data.oldPayPass = md5(values.oldPayPass).toUpperCase();
    }

    console.log(data);

    setPayPassMutation.mutate({
      data,
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
              {intl.formatMessage({ defaultMessage: '提交', id: 'ENPgS/' })}
            </Button>
          }
        >
          {!!auth.userInfo?.payPass && (
            <Form.Item
              name="oldPayPass"
              rules={[
                {
                  required: true,
                  validator: async (rule, value = '') => {
                    const val = value.trim?.();

                    if (val.length === 0) {
                      throw new Error(
                        intl.formatMessage({ defaultMessage: '請輸入原密碼', id: 'srNPrw' }),
                      );
                    }

                    if (!/^[0-9]+$/.test(val)) {
                      throw new Error(
                        intl.formatMessage({ defaultMessage: '请输入数字', id: 'UnMDmI' }),
                      );
                    }
                  },
                },
              ]}
            >
              <Input
                type="password"
                placeholder={intl.formatMessage({
                  defaultMessage: '請輸入原密碼',
                  id: 'srNPrw',
                })}
                inputMode="numeric"
              />
            </Form.Item>
          )}

          <Form.Item
            name="payPass"
            rules={[
              {
                required: true,
                validator: async (rule, value = '') => {
                  const val = value.trim?.();

                  if (val.length < 6) {
                    throw new Error(
                      intl.formatMessage({ defaultMessage: '請輸入6位支付密碼', id: 'k/3udR' }),
                    );
                  }

                  if (!/^[0-9]+$/.test(val)) {
                    throw new Error(
                      intl.formatMessage({ defaultMessage: '请输入数字', id: 'UnMDmI' }),
                    );
                  }
                },
              },
            ]}
          >
            <Input
              inputMode="numeric"
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
              (form) => ({
                validator: async (rule, value) => {
                  const payPass = form.getFieldValue('payPass');
                  const val = value.trim?.();

                  if (val.length === 0) {
                    throw new Error(
                      intl.formatMessage({ defaultMessage: '請輸入確認密碼', id: 'gYHc6L' }),
                    );
                  }

                  if (!/^[0-9]+$/.test(val)) {
                    throw new Error(
                      intl.formatMessage({ defaultMessage: '请输入数字', id: 'UnMDmI' }),
                    );
                  }

                  if (val !== payPass) {
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
              inputMode="numeric"
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
