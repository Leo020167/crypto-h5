import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { checkEmailCode, getEmail } from '../../../utils/api';

const ModeParam = withDefault(NumberParam, 0);
const EmailAuthCode = () => {
  const history = useHistory();

  const [mode] = useQueryParam('mode', ModeParam);
  const [email] = useQueryParam('email', StringParam);

  const mounted = useRef<boolean>(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    getEmail(email ?? '');
  }, [email]);

  const intl = useIntl();

  const handleFinish = useCallback(
    (values: { code?: string }) => {
      if (!values.code || !values.code.trim().length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請輸入郵箱驗證碼', id: 'Y+Wlw4' }));
        return;
      }

      checkEmailCode({ code: values.code, email: email ?? '' }).then((res) => {
        if (res.code === '200') {
          if (mode === 1) {
            history.push(`/bind-email?${stringify({ email })}`);
          } else {
            Toast.show(intl.formatMessage({ defaultMessage: '驗證成功', id: 'tVv3c7' }));
            history.goBack();
          }
        }
      });
    },
    [email, history, intl, mode],
  );

  return (
    <Container className="h-full bg-[#F0F1F7]">
      <NavBar onBack={() => history.goBack()} className="mb-8 bg-white">
        {intl.formatMessage({ defaultMessage: '郵箱驗證碼', id: '56o47p' })}
      </NavBar>

      <div className="mb-4 text-center text-[#78797d]">
        {intl.formatMessage({ defaultMessage: '驗證碼已發送至，{email}', id: 'Jgy7GK' }, { email })}
      </div>
      <Form
        onFinish={handleFinish}
        className="p-4"
        layout="vertical"
        footer={
          <div className="mt-4">
            <Button type="submit" block size="large" className="submit">
              {intl.formatMessage({ defaultMessage: '發送驗證碼', id: 'MYqUqI' })}
            </Button>
          </div>
        }
      >
        <Form.Item name="code">
          <Input
            type="code"
            placeholder={intl.formatMessage({ defaultMessage: '請輸入郵箱驗證碼', id: 'Y+Wlw4' })}
          />
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  .submit {
    background-color: #fe6b1d;
    color: #fff;
  }
`;
export default EmailAuthCode;
