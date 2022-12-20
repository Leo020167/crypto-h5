import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useCounter, useInterval } from 'react-use';
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

  return (
    <Container className="h-screen bg-white">
      <NavBar
        onBack={() => {
          history.goBack();
        }}
      />

      <div className="p-8">
        <h1 className=" text-3xl font-bold mb-2">
          {intl.formatMessage({ defaultMessage: '输入验证码', id: '4FDcHK' })}
        </h1>
        <div className="mb-8">
          {intl.formatMessage(
            { defaultMessage: `请获取{text}`, id: 'agICfX' },
            {
              text,
            },
          )}
        </div>

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
              {intl.formatMessage({ defaultMessage: '完成验证', id: 'jAROVC' })}
            </Button>
          }
        >
          <Form.Item
            className="mb-8"
            extra={
              send ? (
                <a
                  className=" border-gray-400 border-2 rounded text-gray-400 text-sm px-2 py-1"
                  onClick={() => setOpen(true)}
                >
                  {intl.formatMessage({ defaultMessage: '{count}s', id: '1ix6NP' }, { count })}
                </a>
              ) : (
                <a
                  className=" border-[#dcb585] border-2 rounded text-[#dcb585] text-sm px-2 py-1"
                  onClick={() => setOpen(true)}
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
          setSend(true);
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
