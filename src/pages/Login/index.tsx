import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import md5 from 'js-md5';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { useAuthStore } from '../../stores/auth';

const Login = () => {
  const [visible, setVisible] = useState(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const history = useHistory();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const [loading, setLoading] = useState(false);
  const authStore = useAuthStore();

  const intl = useIntl();

  return (
    <div className="bg-white">
      <NavBar
        onBack={() => {
          history.goBack();
        }}
        right={
          <Link to="/signup" className="text-black">
            {intl.formatMessage({ defaultMessage: '注冊賬號', id: '3cuhJj' })}
          </Link>
        }
      />
      <div className="h-screen bg-white px-4 py-4">
        <Container className="px-4">
          <h1 className="py-8 text-2xl">
            {intl.formatMessage({ defaultMessage: '登錄', id: 'wAPEnf' })}
          </h1>
          <div>
            <Form
              onFinish={() => {
                setLoading(true);
                const isEmail =
                  /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(
                    username,
                  );

                authStore
                  .login({
                    phone: isEmail ? '' : username,
                    type: isEmail ? 2 : 1,
                    email: isEmail ? username : '',
                    userPass: md5(password ?? ''),
                    platform: 'web',
                    smsCode: '',
                  })
                  .then(async (data) => {
                    if (data.code === '200') {
                      history.replace(from);
                    } else {
                      Toast.show(data.msg);
                    }
                  })
                  .finally(() => setLoading(false));
              }}
              footer={
                <div>
                  <Button
                    block
                    type="submit"
                    color="primary"
                    className="rounded-none"
                    loading={loading}
                  >
                    {intl.formatMessage({ defaultMessage: '登錄', id: 'wAPEnf' })}
                  </Button>
                  <div className="text-center mt-4">
                    <Link to="/reset-password">
                      {intl.formatMessage({ defaultMessage: '忘記了？找回密碼', id: 'oR5wwN' })}
                    </Link>
                  </div>
                </div>
              }
            >
              <Form.Item name="username">
                <Input
                  placeholder={intl.formatMessage({ defaultMessage: '郵箱或手機', id: 'DNlbBz' })}
                  onChange={setUsername}
                />
              </Form.Item>
              <Form.Item name="password">
                <div className="password">
                  <Input
                    className="input"
                    placeholder={intl.formatMessage({ defaultMessage: '請輸入密碼', id: '63r2yf' })}
                    type={visible ? 'text' : 'password'}
                    onChange={setPassword}
                  />
                  <div className="eye">
                    {!visible ? (
                      <EyeInvisibleOutline onClick={() => setVisible(true)} />
                    ) : (
                      <EyeOutline onClick={() => setVisible(false)} />
                    )}
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

const Container = styled.div`
  .adm-list-body {
    border: 0;
    .adm-list-body-inner {
      margin: 0;
    }

    .adm-list-item {
      padding-left: 0;
    }

    .adm-list-item-content {
      border-top: 0;
      border-bottom: var(--border-inner);
    }
  }

  .adm-form-footer {
    padding: 20px 0;
  }

  .password {
    display: flex;
    align-items: center;
    .input {
      flex: auto;
    }
    .eye {
      flex: none;
      margin-left: 8px;
      padding: 4px;
      cursor: pointer;
      svg {
        display: block;
        font-size: var(--adm-font-size-7);
      }
    }
  }
`;

export default Login;
