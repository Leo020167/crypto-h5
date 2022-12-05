import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useQueryParam, StringParam } from 'use-query-params';
import { useAuthStore } from '../../../stores/auth';

import { updateEmail } from '../../../utils/api';
import { TypeParam } from '../../../utils/params';

const BindEmailCode = () => {
  const history = useHistory();

  const [type] = useQueryParam('type', TypeParam);
  const [email] = useQueryParam('email', StringParam);
  const [redirectUrl] = useQueryParam('redirectUrl', StringParam);

  const { getUserInfo } = useAuthStore();

  const handleFinish = useCallback(
    (values: { code?: string }) => {
      if (!values.code || !values.code.trim().length) {
        Toast.show('請輸入郵箱驗證碼');
        return;
      }

      updateEmail({ email: email ?? '', code: values.code }).then((res) => {
        if (res.code === '200') {
          getUserInfo();

          Toast.show('綁定成功');

          if (type === 1 && redirectUrl) {
            history.replace({ pathname: redirectUrl }, { state: { success: true } });
          } else {
            history.replace('/my');
          }
        } else {
          Toast.show(res.msg);
        }
      });
    },
    [email, getUserInfo, history, redirectUrl, type],
  );

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar onBack={() => history.goBack()} className="bg-white mb-8">
        郵箱驗證碼
      </NavBar>

      <div className="text-center mb-4 text-[#78797d]">{`驗證碼已發送至，${email}`}</div>

      <Form
        onFinish={handleFinish}
        className="p-4"
        layout="vertical"
        footer={
          <div className="mt-4">
            <Button type="submit" block size="large" className="submit">
              下一步
            </Button>
          </div>
        }
      >
        <Form.Item name="code">
          <Input type="text" placeholder="請輸入郵箱驗證碼" />
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
export default BindEmailCode;
