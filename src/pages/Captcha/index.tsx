import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { registerAtom, tokenAtom, userAtom } from '../../atoms';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { doSecurityRegister, getSms } from '../../utils/api';

const Captcha = () => {
  const navigate = useNavigate();
  const [register] = useAtom(registerAtom);

  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [smsCode, setSmsCode] = useState<string>('');
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          navigate(-1);
        }}
      />

      <div className="p-8">
        <h1 className=" text-3xl font-bold mb-2">输入验证码</h1>
        <div className="mb-8">请获取短信验证</div>

        <Form
          layout="horizontal"
          onFinish={() => {
            doSecurityRegister({ ...register, smsCode });
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
            ...register,
            locationx: positionX,
            dragImgKey,
            smsCode,
            sex: 0,
          }).then((res: any) => {
            Toast.show(res.msg);

            if (res.code === '200') {
              setToken(res.data.token);
              setUser(res.data.user);
              navigate('/home', { replace: true });
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
            countryCode: register?.countryCode ?? '',
            dragImgKey: dragImgKey,
            locationx: positionX,
            sendAddr: register?.type === 1 ? register?.phone ?? '' : register?.email ?? '',
            type: register?.type ?? 1,
          }).then((res: any) => {
            if (res.code !== '200') {
              Toast.show(res.msg);
            }
          });

          if (register?.phone) {
            const phone = register.phone.substring(0, 3) + '****' + register.phone.substring(7);
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
