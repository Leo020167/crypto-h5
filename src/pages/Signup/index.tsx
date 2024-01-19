import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import AreaList from '../../components/AreaList';
import useCountry from '../../hooks/useCountry';
import { AreaListItem } from '../../model';
import { useSignUpStore } from '../../stores/signup';
import { validPassword } from '../../utils/validation';
import {useRegister} from "../../api/endpoints/transformer";
import {useAuthStore} from "../../stores/auth";
import md5 from "js-md5";

const Signup = () => {
  const history = useHistory();

  const [country, setCountry] = useCountry();

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const { value, setValue } = useSignUpStore();

  const auth = useAuthStore();

  useEffect(() => {
    if (value.type) {
      form.setFieldsValue(value);
    }
  }, [form, value]);

  const intl = useIntl();

  useEffect(() => {
    setValue({ type: 1 });
  }, [setValue]);

  const register = useRegister({
    mutation: {
      onSuccess(data) {
        Toast.show(data.msg);

        if (data.code === '200') {
          auth.signup({ token: data.data?.token, user: data.data?.user });
          history.replace('/home');
        }
      },
    },
  });

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          history.replace({ pathname: '/login' });
        }}
      />

      <div className="p-8">
        <h1 className="text-2xl font-bold ">
          {intl.formatMessage({ defaultMessage: '注册', id: 'MmsEyp' })}
        </h1>
        <Form
          form={form}
          layout="horizontal"
          onFinish={(values) => {
            if (value.type === 1) {
              if (!values.phone || !values.phone.trim().length) {
                Toast.show(
                  intl.formatMessage({ defaultMessage: '手機號碼不能為空', id: 'B+KT/l' }),
                );
                return;
              }
            }

            if (value.type === 2) {
              if (!values.email) {
                Toast.show(intl.formatMessage({ defaultMessage: '請輸入郵箱號', id: 'NlcysC' }));
                return;
              }
            }

            if (!validPassword(intl, values.userPass, values.configUserPass)) {
              return;
            }

            setValue({ ...value, ...values, countryCode: country.code });

            register.mutate({
              data: {
                ...(value as any),
                inviteCode: value.inviteCode || '',
                userPass: md5(value.userPass ?? ''),
                configUserPass: md5(value.configUserPass ?? ''),
                dragImgKey: '',
                locationx: 0,
                smsCode: '',
                sex: 0,
              },
            });
            // history.push({
            //   pathname: '/captcha',
            // });
          }}
          footer={
            <div>
              {value.type === 1 && (
                <div className="text-[#cdcdcd]">
                  {intl.formatMessage({ defaultMessage: '注册即代表你已同意并接受', id: 'A20Ity' })}
                  <a
                    href={`http://api.${
                      import.meta.env.VITE_APP_DOMAIN
                    }/procoin/article/#/passgeDetail?article_id=480`}
                    target="_blank"
                    className="text-[#6277b0]"
                    rel="noreferrer"
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: '《{name}用户协议》',
                        id: 'uoCZsI',
                      },
                      {
                        name: 'ACGT',
                      },
                    )}
                  </a>
                  {intl.formatMessage({ defaultMessage: '和', id: 's9xFxt' })}
                  <a
                    href={`http://api.${
                      import.meta.env.VITE_APP_DOMAIN
                    }/procoin/article/#/passgeDetail?article_id=540`}
                    target="_blank"
                    className="text-[#6277b0]"
                    rel="noreferrer"
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: '《{name}隐私条款》',
                        id: 'rv44i+',
                      },
                      {
                        name: 'ACGT',
                      },
                    )}
                  </a>
                </div>
              )}

              <div className="mt-8">
                <Button block type="submit" color="primary" className="rounded-none">
                  {intl.formatMessage({ defaultMessage: '注册', id: 'MmsEyp' })}
                </Button>
              </div>

              <div className="text-center mt-4">
                {value.type === 1 ? (
                  <a
                    className="text-[#6277b0]"
                    onClick={() => {
                      setValue({ ...value, type: 2 });
                    }}
                  >
                    {intl.formatMessage({ defaultMessage: '邮箱注册', id: 'eMnHfD' })}
                  </a>
                ) : (
                  <a
                    className="text-[#6277b0]"
                    onClick={() => {
                      setValue({ ...value, type: 1 });
                    }}
                  >
                    {intl.formatMessage({ defaultMessage: '手机注册', id: 'dfT5lg' })}
                  </a>
                )}
              </div>
            </div>
          }
        >
          {value.type === 1 ? (
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
                <Input
                  placeholder={intl.formatMessage({
                    defaultMessage: '请输入手机号码',
                    id: 'ejs0A3',
                  })}
                />
              </Form.Item>
            </>
          ) : (
            <Form.Item name="email">
              <Input
                type="email"
                placeholder={intl.formatMessage({
                  defaultMessage: '邮箱',
                  id: 'hDx3/S',
                })}
              />
            </Form.Item>
          )}

          <Form.Item name="userPass">
            <Input
              type="password"
              placeholder={intl.formatMessage({
                defaultMessage: '密码必须是8 -16位',
                id: 'xalGPW',
              })}
            />
          </Form.Item>
          <Form.Item name="configUserPass">
            <Input
              type="password"
              placeholder={intl.formatMessage({
                defaultMessage: '请再次输入密码',
                id: 'MPJViy',
              })}
            />
          </Form.Item>
          <Form.Item name="inviteCode">
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '请输入邀请码',
                id: 'VU6g7c',
              })}
            />
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
  .adm-nav-bar {
    border: 0;
  }
  .adm-form-footer {
    padding: 20px 0;
  }

  .phone-prefix-number {
    .adm-list-item-content-main {
      color: #212f51;
    }
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
