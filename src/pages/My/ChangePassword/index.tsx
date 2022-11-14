import { Form, NavBar, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Password from '../../../components/Password';
import { ChangePasswordInput } from '../../../model';
import { updateUserPass } from '../../../utils/api';
import { validPassword } from '../../../utils/validation';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  return (
    <Container className="h-screen bg-[#f0f1f5]">
      <NavBar
        className="mb-2 bg-white"
        onBack={() => navigate(-1)}
        right={
          <a
            onClick={() => {
              form.validateFields().then((values: ChangePasswordInput) => {
                if (!values.oldUserPass || !values.oldUserPass.trim().length) {
                  Toast.show('請輸入原密碼');
                  return;
                }

                if (!validPassword(values.newUserPass, values.configUserPass)) {
                  return;
                }

                updateUserPass(values).then((res) => {
                  Toast.show(res.msg);

                  if (res.code === '200') {
                    navigate(-1);
                  }
                });
              });
            }}
          >
            确定
          </a>
        }
      />

      <Form form={form}>
        <Form.Item name="oldUserPass">
          <Password placeholder="输入旧密码" />
        </Form.Item>

        <Form.Item name="newUserPass">
          <Password placeholder="设置新密码(8-16位字、字母组合)" />
        </Form.Item>

        <Form.Item name="configUserPass">
          <Password placeholder="确认新密码" />
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div``;

export default ChangePassword;
