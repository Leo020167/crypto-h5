import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useQueryParam, StringParam } from 'use-query-params';
import { getEmail } from '../../../utils/api';
import { TypeParam } from '../../../utils/params';

const BindEmail = () => {
  const history = useHistory();

  const [type] = useQueryParam('type', TypeParam);
  const [email] = useQueryParam('email', StringParam);
  const [redirectUrl] = useQueryParam('redirectUrl', StringParam);

  const handleFinish = useCallback(
    (values: { email?: string }) => {
      if (!values.email || !values.email.trim().length) {
        Toast.show('請輸入郵箱');
        return;
      }

      getEmail(values.email).then((res) => {
        if (res.code === '200') {
          Toast.show(res.msg);

          history.push({
            pathname: '/bind-email-code',
            search: stringify({ type: type === 1 ? 1 : undefined, email, redirectUrl }),
          });
        }
      });
    },
    [email, history, redirectUrl, type],
  );

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar onBack={() => history.goBack()} className="bg-white mb-8">
        請輸入新郵箱
      </NavBar>

      {email && (
        <div className="text-center mb-4 text-[#78797d]">{`您目前的郵箱是${email}，想要把它更新為？`}</div>
      )}

      <Form
        onFinish={handleFinish}
        className="p-4"
        layout="vertical"
        footer={
          <div className="mt-4">
            <Button type="submit" block size="large" className="submit">
              发送验证码
            </Button>
          </div>
        }
      >
        <Form.Item name="email">
          <Input type="email" placeholder="请输入邮箱" />
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  .submit {
    color: #fff;
    background-color: #fe6b1d;
  }
`;
export default BindEmail;
