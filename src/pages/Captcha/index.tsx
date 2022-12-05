import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import SwipeImageValidator from '../../components/SwipeImageValidator';
import { useSignUpStore } from '../../stores/signup';
import { doSecurityRegister, getSms } from '../../utils/api';

const Captcha = () => {
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [smsCode, setSmsCode] = useState<string>('');

  const { value } = useSignUpStore();

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          history.goBack();
        }}
      />

      <div className="p-8">
        <h1 className=" text-3xl font-bold mb-2">输入验证码</h1>
        <div className="mb-8">请获取短信验证</div>

        <Form
          layout="horizontal"
          onFinish={() => {
            doSecurityRegister({ ...value, smsCode });
          }}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              disabled={smsCode.length !== 6}
              onClick={() => setRegisterOpen(true)}
            >
              完成验证
            </Button>
          }
        >
          <Form.Item
            className="mb-8"
            extra={
              <a
                className=" border-[#dcb585] border-2 rounded text-[#dcb585] text-sm px-2 py-1"
                onClick={() => setOpen(true)}
              >
                获取验证码
              </a>
            }
          >
            <Input placeholder="请输入验证码" onChange={setSmsCode} />
          </Form.Item>
        </Form>
      </div>

      <SwipeImageValidator
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccess={(positionX, dragImgKey) => {
          doSecurityRegister({
            ...value,
            locationx: positionX,
            dragImgKey,
            smsCode,
            sex: 0,
          }).then((res: any) => {
            Toast.show(res.msg);

            if (res.code === '200') {
              history.replace('/home');
            }
          });

          setRegisterOpen(false);
        }}
      />

      <SwipeImageValidator
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(positionX, dragImgKey) => {
          getSms({
            countryCode: value?.countryCode ?? '',
            dragImgKey: dragImgKey,
            locationx: positionX,
            sendAddr: value?.type === 1 ? value?.phone ?? '' : value?.email ?? '',
            type: value?.type ?? 1,
          }).then((res: any) => {
            if (res.code !== '200') {
              Toast.show(res.msg);
            }
          });

          if (value?.phone) {
            const phone = value.phone.substring(0, 3) + '****' + value.phone.substring(7);
            Toast.show(`短信验证码已经发送至${phone}`);
          }

          setOpen(false);
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  .adm-nav-bar {
    border-bottom: 1px solid #f6f6f6;
  }
`;

export default Captcha;
