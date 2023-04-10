import { Button, Form, Input, NavBar, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { getEmail } from '../../../utils/api';
import { TypeParam } from '../../../utils/params';

const BindEmail = () => {
  const history = useHistory();

  const [type] = useQueryParam('type', TypeParam);
  const [email] = useQueryParam('email', StringParam);
  const [redirectUrl] = useQueryParam('redirectUrl', StringParam);

  const intl = useIntl();

  const handleFinish = useCallback(
    (values: { email?: string }) => {
      if (!values.email || !values.email.trim().length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請輸入郵箱', id: 'NZTO6Y' }));
        return;
      }

      getEmail(values.email).then((res) => {
        if (res.code === '200') {
          Toast.show(res.msg);

          history.push({
            pathname: '/bind-email-code',
            search: stringify({
              type: type === 1 ? 1 : undefined,
              email: values.email,
              redirectUrl,
            }),
          });
        }
      });
    },
    [history, intl, redirectUrl, type],
  );

  return (
    <Container className="h-full bg-[#F0F1F7]">
      <NavBar onBack={() => history.goBack()} className="mb-8 bg-white">
        {intl.formatMessage({ defaultMessage: '請輸入新郵箱', id: 'ulKN6p' })}
      </NavBar>

      {email && (
        <div className="mb-4 text-center text-[#78797d]">
          {intl.formatMessage(
            { defaultMessage: '您目前的郵箱是{email}，想要把它更新為？', id: 'HcSaEz' },
            { email },
          )}
        </div>
      )}

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
        <Form.Item name="email" initialValue={email}>
          <Input
            type="email"
            placeholder={intl.formatMessage({ defaultMessage: '請輸入郵箱', id: 'NZTO6Y' })}
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
export default BindEmail;
