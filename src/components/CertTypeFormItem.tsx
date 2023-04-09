import { Form, FormItemProps, Picker } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useIdentityConfig } from '../api/endpoints/transformer';

type CertTypeFormItemProps = FormItemProps;
export const CertTypeFormItem = (props: CertTypeFormItemProps) => {
  const [visible, setVisible] = useState(false);

  const { data } = useIdentityConfig();
  const items = data?.data ?? [];

  const intl = useIntl();
  return (
    <Form.Item
      {...props}
      name="certType"
      label={intl.formatMessage({ defaultMessage: '證件類型', id: 'foUhnV' })}
      trigger="onConfirm"
      rules={[
        {
          required: true,
          message: intl.formatMessage({ defaultMessage: '請選擇證件類型', id: 'GAZ/J4' }),
        },
      ]}
      onClick={() => {
        setVisible(true);
      }}
    >
      <Picker
        columns={[items.map((v) => ({ label: v.name ?? '', value: v.code ?? '' }))]}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        {(value) =>
          value?.length
            ? value[0]?.label
            : intl.formatMessage({ defaultMessage: '請選擇證件類型', id: 'GAZ/J4' })
        }
      </Picker>
    </Form.Item>
  );
};
