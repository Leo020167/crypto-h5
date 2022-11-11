import { Button, Form, Input } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SwipeImageValidator from '../../components/SwipeImageValidator';

const Login = () => {
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(false);
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
            footer={
              <div>
                <Button block type="submit" color="primary" size="large" className="rounded-none">
                  登录
                </Button>
                <div className="text-center mt-4">
                  <Link to="">忘记了？找回密码</Link>
                </div>
              </div>
            }
          >
            <Form.Item name="username" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="password">
              <div className="password">
                <Input
                  className="input"
                  placeholder="请输入密码"
                  type={visible ? 'text' : 'password'}
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
        open={valid}
        onClose={() => setValid(false)}
        onSuccess={() => {
          setValid(false);
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
