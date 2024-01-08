import { Button, Form, Input, Toast } from 'antd-mobile';
import md5 from 'js-md5';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useCounter, useInterval } from 'react-use';
import { useRegister, useSmsGet } from '../../api/endpoints/transformer';
import { useAuthStore } from '../../stores/auth';

import Screen from '../../components/Screen';
import { useSignUpStore } from '../../stores/signup';

const Captcha = () => {
  const history = useHistory();

  const [smsCode, setSmsCode] = useState<string>('');

  const { value } = useSignUpStore();

  const auth = useAuthStore();

  const intl = useIntl();

  const text =
    value.type === 1
      ? intl.formatMessage({ defaultMessage: '短信验证', id: 'Uju5sq' })
      : intl.formatMessage({ defaultMessage: '邮箱验证码', id: 'xry82G' });

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

  const smsGet = useSmsGet();

  const handleSendSms = useCallback(() => {
    setSend(true);

    smsGet.mutate({
      data: {
        countryCode: value?.countryCode ?? '',
        sendAddr: value?.type === 1 ? value?.phone ?? '' : value?.email ?? '',
        type: value?.type ?? 1,
        locationx: 0,
        dragImgKey: '',
      },
    });

    if (value?.phone) {
      const phoneNumber = value.phone.substring(0, 3) + '****' + value.phone.substring(7);
      Toast.show(
        intl.formatMessage(
          {
            defaultMessage: '短信验证码已经发送至{phoneNumber}',
            id: 'yzNVN7',
          },
          {
            phoneNumber,
          },
        ),
      );
    }
  }, [intl, smsGet, value?.countryCode, value?.email, value.phone, value?.type]);

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
    <Screen navBarProps={{ onBack: () => history.goBack() }}>
      <div className="p-8">
        <h1 className=" mb-2 text-3xl font-bold">
          {intl.formatMessage({ defaultMessage: '输入验证码', id: '4FDcHK' })}
        </h1>
        <div className="mb-8">
          {intl.formatMessage(
            { defaultMessage: '请获取{text}', id: 'agICfX' },
            {
              text,
            },
          )}
        </div>

        <Form
          layout="horizontal"
          onFinish={() => {
            register.mutate({
              data: {
                ...(value as any),
                inviteCode: value.inviteCode || '',
                userPass: md5(value.userPass ?? ''),
                configUserPass: md5(value.configUserPass ?? ''),
                dragImgKey: '',
                locationx: 0,
                smsCode,
                sex: 0,
              },
            });
          }}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={register.isLoading}
              disabled={smsCode.length !== 6}
            >
              {intl.formatMessage({ defaultMessage: '完成验证', id: 'jAROVC' })}
            </Button>
          }
        >
          <Form.Item
            className="mb-8"
            extra={
              send ? (
                <a className=" rounded border-2 border-gray-400 px-2 py-1 text-sm text-gray-400">
                  {intl.formatMessage({ defaultMessage: '{count}s', id: '1ix6NP' }, { count })}
                </a>
              ) : (
                <a
                  className=" rounded border border-[#D9BD93] px-2 py-1 text-sm text-[#D9BD93]"
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
        </Form>
      </div>
    </Screen>
  );
};

export default Captcha;
