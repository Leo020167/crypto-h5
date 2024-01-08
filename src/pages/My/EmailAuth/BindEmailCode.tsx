import { Button, Form, Input, Toast } from 'antd-mobile';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuthStore } from '../../../stores/auth';

import Screen from '../../../components/Screen';
import { updateEmail } from '../../../utils/api';
import { TypeParam } from '../../../utils/params';

const BindEmailCode = () => {
  const history = useHistory();

  const [type] = useQueryParam('type', TypeParam);
  const [email] = useQueryParam('email', StringParam);
  const [redirectUrl] = useQueryParam('redirectUrl', StringParam);

  const { getUserInfo } = useAuthStore();

  const intl = useIntl();

  const handleFinish = useCallback(
    (values: { code?: string }) => {
      if (!values.code || !values.code.trim().length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請輸入郵箱驗證碼', id: 'Y+Wlw4' }));
        return;
      }

      updateEmail({ email: email ?? '', code: values.code }).then((res) => {
        if (res.code === '200') {
          getUserInfo();

          Toast.show(intl.formatMessage({ defaultMessage: '綁定成功', id: 'q+on8I' }));

          if (type === 1 && redirectUrl) {
            history.replace({ pathname: redirectUrl }, { state: { success: true } });
          } else {
            history.replace('/my');
          }
        } else {
          Toast.show(res.msg);
        }
      });
    },
    [email, getUserInfo, history, intl, redirectUrl, type],
  );

  return (
    <Screen
      navBarProps={{ onBack: () => history.goBack() }}
      headerTitle={intl.formatMessage({ defaultMessage: '郵箱驗證碼', id: '56o47p' })}
    >
      <div className="mt-4 text-center text-[#78797d]">
        {intl.formatMessage({ defaultMessage: '驗證碼已發送至，{email}', id: 'Jgy7GK' }, { email })}
      </div>

      <Form
        onFinish={handleFinish}
        className="p-4"
        layout="vertical"
        footer={
          <div className="mt-4">
            <Button color="primary" block>
              {intl.formatMessage({ defaultMessage: '下一步', id: '6Y0p2/' })}
            </Button>
          </div>
        }
      >
        <Form.Item name="code">
          <Input
            type="text"
            placeholder={intl.formatMessage({ defaultMessage: '請輸入郵箱驗證碼', id: 'Y+Wlw4' })}
          />
        </Form.Item>
      </Form>
    </Screen>
  );
};

export default BindEmailCode;
