import { Form, Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Password from '../../../components/Password';
import Screen from '../../../components/Screen';
import { ChangePasswordInput } from '../../../model';
import { updateUserPass } from '../../../utils/api';
import { validPassword } from '../../../utils/validation';

const ChangePassword = () => {
  const history = useHistory();

  const [form] = Form.useForm();

  const intl = useIntl();

  return (
    <Screen
      navBarProps={{
        onBack: () => history.goBack(),
        right: (
          <a
            onClick={() => {
              form.validateFields().then((values: ChangePasswordInput) => {
                if (!values.oldUserPass || !values.oldUserPass.trim().length) {
                  Toast.show(intl.formatMessage({ defaultMessage: '請輸入原密碼', id: 'srNPrw' }));
                  return;
                }

                if (!validPassword(intl, values.newUserPass, values.configUserPass)) {
                  return;
                }

                updateUserPass(values).then((res) => {
                  Toast.show(res.msg);

                  if (res.code === '200') {
                    history.goBack();
                  }
                });
              });
            }}
          >
            {intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' })}
          </a>
        ),
      }}
    >
      <Form form={form}>
        <Form.Item name="oldUserPass">
          <Password
            placeholder={intl.formatMessage({ defaultMessage: '輸入舊密碼', id: 'FXys9B' })}
          />
        </Form.Item>

        <Form.Item name="newUserPass">
          <Password
            placeholder={intl.formatMessage({
              defaultMessage: '設置新密碼(8-16位字、字母組合)',
              id: '6zlqMT',
            })}
          />
        </Form.Item>

        <Form.Item name="configUserPass">
          <Password
            placeholder={intl.formatMessage({
              defaultMessage: '確認新密碼',
              id: 'VbE2gD',
            })}
          />
        </Form.Item>
      </Form>
    </Screen>
  );
};

export default ChangePassword;
