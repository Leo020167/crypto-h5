import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { countryAtom } from '../../atoms';
import AreaList from '../../components/AreaList';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { AreaListItem } from '../../model';
import { doSecurityForgetPass, getSms } from '../../utils/api';
import { validPassword } from '../../utils/validation';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [country, setCountry] = useAtom(countryAtom);

  const [open, setOpen] = useState(false);
  const [openSmsCodeVerity, setOpenSmsCodeVerity] = useState(false);
  const [openCompleteVerity, setOpenCompleteVerity] = useState(false);

  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');

  const [form] = Form.useForm();

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          navigate({ pathname: '/login' }, { replace: true });
        }}
      />

      <div className="p-8">
        <h1 className="text-2xl font-bold ">重置密码</h1>
        <Form
          form={form}
          layout="horizontal"
          onFinish={(values) => {
            if (!values.phone || !values.phone.trim().length) {
              Toast.show('手機號碼不能為空');
              return;
            }

            if (!validPassword(values.userPass, values.configUserPass)) {
              return;
            }

            setOpenCompleteVerity(true);
          }}
          footer={
            <div>
              <Button block type="submit" color="primary" className="rounded-none mt-8 ">
                完成
              </Button>
            </div>
          }
        >
          <div className="mt-6 mb-2 locale pl-2 flex items-center" onClick={() => setOpen(true)}>
            {country.name}
            <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
          </div>

          <Form.Item
            name="phone"
            label={
              <div className="pl-2 flex items-center justify-center" onClick={() => setOpen(true)}>
                {country.code} <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
              </div>
            }
            className="phone"
          >
            <Input placeholder="请输入手机号码" onChange={setPhone} />
          </Form.Item>

          <Form.Item
            extra={
              <a
                className=" border-[#dcb585] border-2 rounded text-[#dcb585] text-sm px-2 py-1"
                onClick={() => setOpenSmsCodeVerity(true)}
              >
                获取验证码
              </a>
            }
          >
            <Input placeholder="请输入验证码" onChange={setSmsCode} />
          </Form.Item>

          <Form.Item name="userPass">
            <Input
              type="password"
              placeholder="密必须是8-16位字、字母组合"
              onChange={setPassword}
            />
          </Form.Item>

          <Form.Item name="configUserPass">
            <Input type="password" placeholder="请再次输入密码" />
          </Form.Item>
        </Form>
      </div>

      <AreaList
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(area: AreaListItem) => {
          setCountry({ code: area.areaCode, name: area.tcName });

          setOpen(false);
        }}
      />

      <SwipeImageValidator
        key="completeVerity"
        open={openCompleteVerity}
        onClose={() => setOpenCompleteVerity(false)}
        onSuccess={(locationX: number, dragImgKey: string) => {
          doSecurityForgetPass({
            locationx: locationX,
            dragImgKey,
            phone: phone,
            smsCode: smsCode,
            userPass: password,
          })
            .then((res: any) => {
              Toast.show(res.msg);

              if (res.code === '200') {
                navigate('/login', { replace: true });
              }
            })
            .finally(() => {
              setOpenCompleteVerity(false);
            });
        }}
      />

      <SwipeImageValidator
        key="smsCodeVerity"
        open={openSmsCodeVerity}
        onClose={() => setOpenSmsCodeVerity(false)}
        onSuccess={(locationX: number, dragImgKey: string) => {
          getSms({
            countryCode: country.code,
            dragImgKey: dragImgKey,
            locationx: locationX,
            sendAddr: phone,
            type: 1,
          })
            .then((res: any) => {
              Toast.show(res.msg);
            })
            .finally(() => {
              setOpenSmsCodeVerity(false);
            });
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  .phone-prefix-number {
    .adm-list-item-content-main {
      color: #212f51;
    }
  }

  .locale,
  .adm-form-item-label,
  .adm-input-element {
    font-size: 0.875rem;
  }

  .adm-list-item {
    padding-left: 0;
    .adm-list-item-content {
      border-top: 0;
      border-bottom: var(--border-inner);
    }
  }

  .phone {
    .adm-list-item-content-prefix {
      width: auto;
      .adm-form-item-label {
        display: flex;
        justify-content: center;
      }
    }
  }
`;

export default ResetPassword;
