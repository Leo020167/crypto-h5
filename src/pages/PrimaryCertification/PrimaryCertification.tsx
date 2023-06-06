import { Button, Form, Input, Toast } from 'antd-mobile';
import { compact } from 'lodash-es';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useIdentityGet, useIdentitySubmit } from '../../api/endpoints/transformer';
import { IdentitySubmitBody } from '../../api/model';
import { CertTypeFormItem } from '../../components';
import Screen from '../../components/Screen';

export const PrimaryCertification = () => {
  const intl = useIntl();

  const identityGet = useIdentityGet({ type: '1' });

  const identityAuth = identityGet.data?.data?.identityAuth;

  const [form] = Form.useForm<
    IdentitySubmitBody & {
      certType: string[];
    }
  >();

  useEffect(() => {
    if (identityAuth) {
      form.setFieldsValue({
        name: identityAuth.name,
        certType: compact(identityAuth.certType),
        certNo: identityAuth.certNo,
      });
    }
  }, [form, identityAuth]);

  const history = useHistory();
  const identitySubmit = useIdentitySubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(intl.formatMessage({ defaultMessage: '操作成功', id: 'V0RiZp' }));
          history.replace('/home/my');
        }
      },
    },
  });

  const isValid = ['0', '1'].includes(identityAuth?.state as string);

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '初級認證', id: 'cZ6U4z' })}>
      <Container>
        <Form
          form={form}
          className="bg-white px-4"
          onFinish={(values) => {
            identitySubmit.mutate({
              data: {
                type: '1',
                certType: values.certType?.[0],
                name: values.name,
                certNo: values.certNo,
              },
            });
          }}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={identitySubmit.isLoading}
              disabled={isValid}
            >
              {intl.formatMessage({ defaultMessage: '提交', id: 'ENPgS/' })}
            </Button>
          }
        >
          <CertTypeFormItem disabled={isValid} />

          <Form.Item
            disabled={isValid}
            name="name"
            label={intl.formatMessage({ defaultMessage: '姓名', id: '+4lD9e' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ defaultMessage: '請輸入姓名', id: 'ddZtfx' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ defaultMessage: '請輸入姓名', id: 'ddZtfx' })}
            />
          </Form.Item>

          <Form.Item
            disabled={isValid}
            name="certNo"
            label={intl.formatMessage({ defaultMessage: '驗證號碼', id: 'sHN5XP' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ defaultMessage: '請輸入證件號碼', id: 'eoC4eR' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ defaultMessage: '請輸入證件號碼', id: 'eoC4eR' })}
            />
          </Form.Item>
        </Form>
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-form .adm-input-element {
    padding: 0;
  }
`;

export default PrimaryCertification;
