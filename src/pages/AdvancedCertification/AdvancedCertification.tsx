import { Button, Form, ImageUploader, ImageUploadItem, Input, Toast } from 'antd-mobile';
import { compact, first } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useIdentityGet, useIdentitySubmit } from '../../api/endpoints/transformer';
import { CertTypeFormItem } from '../../components';
import Screen from '../../components/Screen';
import { useImageUploaderProps } from '../../hooks/useImageUploaderProps';

import namePng from '../../assets/name.jpg';
/**
 * 实名认证
 * @returns
 */
type FormValue = {
  name?: string;
  certType?: string[];
  frontImgUrl?: ImageUploadItem[];
  backImgUrl?: ImageUploadItem[];
  holdImgUrl?: ImageUploadItem[];
};

const getImages = (img?: string) => {
  return compact([img]).map((url) => ({ url }));
};

const getImageUrl = (items?: ImageUploadItem[]) => {
  return first(items)?.url;
};

const AdvancedCertification = () => {
  const history = useHistory();
  const location = useLocation<{ from: Location }>();

  const [form] = Form.useForm<FormValue>();
  const { data } = useIdentityGet(
    { type: '2' },
    {
      query: {
        onSuccess(data) {
          if (data.data?.identityAuth) {
            const identityAuth = data.data.identityAuth;
            const value = {
              ...identityAuth,
              certType: compact([identityAuth.certType]),
              frontImgUrl: getImages(identityAuth.frontImgUrl),
              backImgUrl: getImages(identityAuth.backImgUrl),
              holdImgUrl: getImages(identityAuth.holdImgUrl),
            };

            form.setFieldsValue(value);
          }
        },
      },
    },
  );

  const intl = useIntl();

  const identitySubmit = useIdentitySubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          const { from } = location.state || { from: { pathname: '/home/my' } };
          history.replace(from);
        }
      },
    },
  });
  const handleFinish = useCallback(
    (values: FormValue) => {
      console.log(values);
      if (!values.name || !values.name.trim().length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請輸入姓名', id: 'ddZtfx' }));
        return;
      }
      if (!values.certType || !values.certType.length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請輸入選擇證件類型', id: 'DXZ6tO' }));
        return;
      }
      if (!values.frontImgUrl || !values.frontImgUrl.length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請上傳證件正面照片', id: 'OzbKU3' }));
        return;
      }
      if (!values.backImgUrl || !values.backImgUrl.length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請上傳證件反面照片', id: 'HFf2ly' }));
        return;
      }
      if (!values.holdImgUrl || !values.holdImgUrl.length) {
        Toast.show(intl.formatMessage({ defaultMessage: '請上傳手持照片', id: 'j88inR' }));
        return;
      }

      identitySubmit.mutate({
        data: {
          type: '2',
          frontImgUrl: getImageUrl(values.frontImgUrl),
          backImgUrl: getImageUrl(values.backImgUrl),
          holdImgUrl: getImageUrl(values.holdImgUrl),
          certType: values.certType?.[0],
          name: values.name,
        },
      });
    },
    [identitySubmit, intl],
  );

  const identityAuth = useMemo(() => data?.data?.identityAuth, [data?.data?.identityAuth]);

  const isValid = useMemo(
    () => ['0', '1'].includes(identityAuth?.state as string),
    [identityAuth?.state],
  );

  const uploadProps = useImageUploaderProps();

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '高級認證', id: 'zQm6Ar' })}>
      {!!data?.data?.identityAuth && (
        <div className="bg-[#FE5400] px-4 py-1 text-xs text-white">
          {`${intl.formatMessage({ defaultMessage: '狀態: ', id: 'BHh721' })}${
            identityAuth?.stateDesc
          } ${
            !isValid
              ? intl.formatMessage(
                  {
                    defaultMessage: '(參數錯誤: {checkMsg})',
                    id: 'eJ3fDL',
                  },
                  {
                    checkMsg: identityAuth?.checkMsg,
                  },
                )
              : ''
          }`}
        </div>
      )}

      <Container className="flex h-full flex-col overflow-y-auto">
        <Form
          className="mt-2.5 px-4"
          form={form}
          onFinish={handleFinish}
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

          <Form.Item name="name" disabled={isValid}>
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '請輸入姓名',
                id: 'ddZtfx',
              })}
            />
          </Form.Item>

          <div className="mt-4 border-l-4 border-[#fa4b1b] px-2.5 text-base">
            {intl.formatMessage({
              defaultMessage: '證件照',
              id: '5EExAw',
            })}
          </div>

          <Form.Item
            name="frontImgUrl"
            label={intl.formatMessage({ defaultMessage: '證件正面照片', id: 'PNGaFx' })}
          >
            <ImageUploader
              {...uploadProps}
              maxCount={1}
              disableUpload={isValid}
              deletable={!isValid}
            />
          </Form.Item>
          <Form.Item
            name="backImgUrl"
            label={intl.formatMessage({ defaultMessage: '證件反面照片', id: 'KQcUcI' })}
          >
            <ImageUploader
              {...uploadProps}
              maxCount={1}
              disableUpload={isValid}
              deletable={!isValid}
            />
          </Form.Item>
          <div className="flex items-center">
            <div>
              <Form.Item
                name="holdImgUrl"
                label={intl.formatMessage({ defaultMessage: '證件手持照片', id: 'WKKdIS' })}
              >
                <ImageUploader
                  {...uploadProps}
                  maxCount={1}
                  disableUpload={isValid}
                  deletable={!isValid}
                />
              </Form.Item>
            </div>

            <img src={namePng} alt="" className="ml-4 mt-6 h-[120px]" />
          </div>
        </Form>

        <div className="flex flex-col items-center justify-center">
          <div className="px-4 pb-4 text-gray-400">
            {intl.formatMessage({
              defaultMessage:
                '上傳的證件照片將進行防盜水印處理，我們嚴格遵照法律法規，保護您的個人隱私。',
              id: 'R4j16W',
            })}
          </div>
        </div>
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-form .adm-input-element {
    padding: 0;
  }

  .adm-image-uploader {
    --cell-size: 120px;
  }

  .adm-space-horizontal > .adm-space-item {
    --gap-horizontal: 0;
  }
`;

export default AdvancedCertification;
