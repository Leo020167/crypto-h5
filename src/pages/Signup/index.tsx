import { Button, Form, Input, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { RegisterTabs } from '../../components';
import AreaList from '../../components/AreaList';
import Screen from '../../components/Screen';
import useCountry from '../../hooks/useCountry';
import { AreaListItem } from '../../model';
import { useSignUpStore } from '../../stores/signup';
import { validPassword } from '../../utils/validation';

const Signup = () => {
  const history = useHistory();

  const [country, setCountry] = useCountry();

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const { value, setValue } = useSignUpStore();

  useEffect(() => {
    if (value.type) {
      form.setFieldsValue(value);
    }
  }, [form, value]);

  const intl = useIntl();

  useEffect(() => {
    setValue({ type: 1 });
  }, [setValue]);

  return (
    <Screen
      className="register-page h-screen bg-white dark:bg-[#161720]"
      navBarProps={{ onBack: () => history.replace({ pathname: '/login' }) }}
    >
      <div>
        <h1 className="my-5 px-8 text-2xl font-bold">
          {intl.formatMessage({ defaultMessage: '注册', id: 'MmsEyp' })}
        </h1>
        <RegisterTabs />
        <div className="px-8">
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

              if (!values.inviteCode?.trim().length) {
                Toast.show(
                  intl.formatMessage({ defaultMessage: '金融机构代码不能為空', id: 'qkiilT' }),
                );
                return;
              }

              setValue({ ...value, ...values, countryCode: country.code });

              history.push({
                pathname: '/captcha',
              });
            }}
            footer={
              <div>
                {value.type === 1 && (
                  <div className="text-[#cdcdcd] dark:text-[#AAAAAA]">
                    {intl.formatMessage({
                      defaultMessage: '注册即代表你已同意并接受',
                      id: 'A20Ity',
                    })}
                    <a href="" target="_blank" className="text-[#6277b0]">
                      {intl.formatMessage(
                        {
                          defaultMessage: '《{name}用户协议》',
                          id: 'uoCZsI',
                        },
                        {
                          name: 'StellarVerse',
                        },
                      )}
                    </a>
                    {intl.formatMessage({ defaultMessage: '和', id: 's9xFxt' })}
                    <a href="" target="_blank" className="text-[#6277b0]">
                      {intl.formatMessage(
                        {
                          defaultMessage: '《{name}隐私条款》',
                          id: 'rv44i+',
                        },
                        {
                          name: 'StellarVerse',
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
              </div>
            }
          >
            {value.type === 1 ? (
              <>
                <div
                  className="locale flex items-center pb-2 pl-2 pt-6 dark:bg-[#161720] "
                  onClick={() => setOpen(true)}
                >
                  {country.name}
                  <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
                </div>

                <Form.Item
                  name="phone"
                  label={
                    <div
                      className="flex items-center justify-center pl-2"
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
                  defaultMessage: '密码必须是8-16位字、字母组合',
                  id: 'y+nnJW',
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
            <Form.Item
              name="inviteCode"
              rules={[
                {
                  pattern: /^\S*$/,
                  message: intl.formatMessage({
                    defaultMessage: '请输入正确的金融机构代码',
                    id: '4BmD4u',
                  }),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({
                  defaultMessage: '请输入金融机构代码(必填)',
                  id: '6jZgrM',
                })}
              />
            </Form.Item>
          </Form>
        </div>
      </div>

      <AreaList
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(area: AreaListItem) => {
          setCountry({ code: area.areaCode, name: area.tcName });

          setOpen(false);
        }}
      />
    </Screen>
  );
};

export default Signup;
