import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useCounter, useInterval } from 'react-use';
import styled from 'styled-components';
import { useSmsGet } from '../../api/endpoints/transformer';
import { countryAtom } from '../../atoms';
import AreaList from '../../components/AreaList';

import { AreaListItem } from '../../model';
import { doSecurityForgetPass } from '../../utils/api';
import { validPassword } from '../../utils/validation';

const ResetPassword = () => {
  const history = useHistory();

  const [country, setCountry] = useAtom(countryAtom);

  const [open, setOpen] = useState(false);

  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');

  const [form] = Form.useForm();

  const intl = useIntl();

  const smsGet = useSmsGet();

  const [send, setSend] = useState(false);
  const [count, { dec, reset }] = useCounter(60, 60, 0);

  useInterval(
    () => {
      if (count > 0) {
        dec();
      } else {
        setSend(false);
        reset();
      }
    },
    send ? 1000 : null,
  );

  const handleSendSms = useCallback(() => {
    setSend(true);

    smsGet.mutate({
      data: {
        countryCode: country.code,
        sendAddr: phone,
        type: 1,
        locationx: 0,
        dragImgKey: '',
      },
    });
  }, [country.code, phone, smsGet]);

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          history.replace({ pathname: '/login' });
        }}
      />

      <div className="p-8">
        <h1 className="text-2xl font-bold ">
          {intl.formatMessage({ defaultMessage: '重置密码', id: 'gsk33w' })}
        </h1>
        <Form
          form={form}
          layout="horizontal"
          onFinish={(values) => {
            if (!values.phone || !values.phone.trim().length) {
              Toast.show(intl.formatMessage({ defaultMessage: '手機號碼不能為空', id: 'B+KT/l' }));
              return;
            }

            if (!validPassword(values.userPass, values.configUserPass)) {
              return;
            }

            doSecurityForgetPass({
              phone: phone,
              smsCode: smsCode,
              userPass: password,
            }).then((res: any) => {
              Toast.show(res.msg);

              if (res.code === '200') {
                history.replace('/login');
              }
            });
          }}
          footer={
            <div>
              <Button block type="submit" color="primary" className="rounded-none mt-8 ">
                {intl.formatMessage({ defaultMessage: '完成', id: 'uHUP9v' })}
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
            <Input
              placeholder={intl.formatMessage({ defaultMessage: '请输入手机号码', id: 'ejs0A3' })}
              onChange={setPhone}
            />
          </Form.Item>

          <Form.Item
            extra={
              send ? (
                <a className=" border-gray-400 border-2 rounded text-gray-400 text-sm px-2 py-1">
                  {intl.formatMessage({ defaultMessage: '{count}s', id: '1ix6NP' }, { count })}
                </a>
              ) : (
                <a
                  className=" border-[#dcb585] border-2 rounded text-[#dcb585] text-sm px-2 py-1"
                  onClick={handleSendSms}
                >
                  {intl.formatMessage({ defaultMessage: '获取验证码', id: 'ypMY0M' })}
                </a>
              )
            }
          >
            <Input
              placeholder={intl.formatMessage({ defaultMessage: '请输入验证码', id: '9UZxwP' })}
              onChange={setSmsCode}
            />
          </Form.Item>

          <Form.Item name="userPass">
            <Input
              type="password"
              placeholder={intl.formatMessage({
                defaultMessage: '密必须是8-16位字、字母组合',
                id: 'MTyrlB',
              })}
              onChange={setPassword}
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
