import { Button, Form, Input, Toast } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { tokenAtom, userAtom } from '../../atoms';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { doSecurityLogin } from '../../utils/api';

const Login = () => {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  return (
    <div className="h-screen bg-white px-4 py-4">
      <div className="text-right pb-2 border-b">
        <Link to="/signup" className="text-black">
          注册账户
        </Link>
      </div>
      <Container className="px-4">
        <h1 className="py-8 text-2xl">登录</h1>
        <div>
          <Form
            onFinish={() => setOpen(true)}
            footer={
              <div>
                <Button block type="submit" color="primary" className="rounded-none">
                  登录
                </Button>
                <div className="text-center mt-4">
                  <Link to="/reset-password">忘记了？找回密码</Link>
                </div>
              </div>
            }
          >
            <Form.Item name="username">
              <Input placeholder="邮箱或手机" onChange={setUsername} />
            </Form.Item>
            <Form.Item name="password">
              <div className="password">
                <Input
                  className="input"
                  placeholder="请输入密码"
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
      <SwipeImageValidator
        title="拖动图片完成验证"
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(locationX, dragImgKey) => {
          const isEmail = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(
            username,
          );

          doSecurityLogin({
            locationx: locationX,
            dragImgKey,
            phone: isEmail ? '' : username,
            type: isEmail ? 2 : 1,
            email: isEmail ? username : '',
            userPass: password,
          }).then((res: any) => {
            Toast.show(res.msg);

            if (res.code === '200') {
              setToken(res.code.token);
              setUser(res.data.user);
              navigate(from, { replace: true });
            }
          });

          setOpen(false);
        }}
      />
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
