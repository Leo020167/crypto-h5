import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { countryAtom, registerAtom } from '../../atoms';
import AreaList from '../../components/AreaList';
import { AreaListItem } from '../../model';
import { validPassword } from '../../utils/validation';

const Signup = () => {
  const navigate = useNavigate();

  const [register, setRegister] = useAtom(registerAtom);
  const [country, setCountry] = useAtom(countryAtom);

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (register) {
      form.setFieldsValue(register);
    }
  }, [form, register]);

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          navigate({ pathname: '/login' }, { replace: true });
        }}
      />

      <div className="p-8">
        <h1 className="text-2xl font-bold ">注册</h1>
        <Form
          form={form}
          layout="horizontal"
          onFinish={(values) => {
            if (register.type === 1) {
              if (!values.phone || !values.phone.trim().length) {
                Toast.show('手機號碼不能為空');
                return;
              }
            }

            if (register.type === 2) {
              if (!values.email) {
                Toast.show('請輸入郵箱號');
                return;
              }
            }

            if (!validPassword(values.userPass, values.configUserPass)) {
              return;
            }
            setRegister({ ...values, countryCode: country.code });
            navigate('/captcha');
          }}
          footer={
            <div>
              {register.type === 1 && (
                <div className="text-[#cdcdcd]">
                  注册即代表你已同意并接受
                  <a href="" target="_blank" className="text-[#6277b0]">
                    《FireUP用户协议》
                  </a>
                  和
                  <a href="" target="_blank" className="text-[#6277b0]">
                    《FireUp隐私条款》
                  </a>
                </div>
              )}

              <Button block type="submit" color="primary" className="rounded-none mt-8 ">
                注册
              </Button>

              <div className="text-center mt-4">
                {register.type === 1 ? (
                  <a
                    className="text-[#6277b0]"
                    onClick={() => {
                      setRegister({ ...register, type: 2 });
                    }}
                  >
                    邮箱注册
                  </a>
                ) : (
                  <a
                    className="text-[#6277b0]"
                    onClick={() => {
                      setRegister({ ...register, type: 1 });
                    }}
                  >
                    手机注册
                  </a>
                )}
              </div>
            </div>
          }
        >
          {register.type === 1 ? (
            <>
              <div
                className="mt-6 mb-2 locale pl-2 flex items-center"
                onClick={() => setOpen(true)}
              >
                {country.name}
                <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
              </div>

              <Form.Item
                name="phone"
                label={
                  <div
                    className="pl-2 flex items-center justify-center"
                    onClick={() => setOpen(true)}
                  >
                    {country.code} <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
                  </div>
                }
                className="phone"
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </>
          ) : (
            <Form.Item name="email">
              <Input type="email" placeholder="邮箱" />
            </Form.Item>
          )}

          <Form.Item name="userPass">
            <Input type="password" placeholder="密必须是8 -16位字、字母组合" />
          </Form.Item>
          <Form.Item name="configUserPass">
            <Input type="password" placeholder="请再次输入密码" />
          </Form.Item>
          <Form.Item name="inviteCode">
            <Input placeholder="请输入邀请码(选填)" />
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
    </Container>
  );
};

const Container = styled.div`
  .adm-form-footer {
    padding: 20px 0;
  }

  .phone-prefix-number {
    .adm-list-item-content-main {
      color: #212f51;
    }
  }

  .adm-nav-bar {
    border-bottom: 1px solid #f6f6f6;
  }

  .adm-list-body {
    border: 0;
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

export default Signup;
