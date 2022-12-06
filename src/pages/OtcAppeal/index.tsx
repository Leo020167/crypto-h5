import { Button, Radio, Space, TextArea, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useOtcGetInitAppealList, useOtcSubmitAppeal } from '../../api/endpoints/transformer';
import { ReactComponent as SvgAlert } from '../../assets/ic_svg_alert.svg';
import ImagePicker from '../../components/ImagePicker';
import Screen from '../../components/Screen';
import { uploadImage } from '../../utils/upload';
import OtcAppealAlertDialog from './OtcAppealAlertDialog';

const OtcAppeal = () => {
  const [orderId] = useQueryParam('orderId', StringParam);

  const [image1Url, setImage1Url] = useState<string>('');
  const [image2Url, setImage2Url] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [open, setOpen] = useState(false);

  const { data } = useOtcGetInitAppealList(
    {
      orderId: orderId ?? '',
    },
    {
      query: {
        enabled: !!orderId,
      },
    },
  );

  const history = useHistory();
  const otcSubmitAppeal = useOtcSubmitAppeal({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.replace({
            pathname: '/legal-order-info',
            search: stringify({ orderId }),
          });
        }
      },
    },
  });

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!reason) {
      Toast.show(intl.formatMessage({ defaultMessage: '請選擇申訴理由', id: 'oslZjc' }));
      return;
    }

    if (content?.trim?.()?.length > 300) {
      Toast.show(intl.formatMessage({ defaultMessage: '留言不能超過300個字符', id: 'PYgwg0' }));
      return;
    }

    setOpen(true);
  }, [content, intl, reason]);

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '申诉', id: 'u1D872' })}
      footer={
        <div className="p-4">
          <Button block color="primary" onClick={handleFinish}>
            {intl.formatMessage({ defaultMessage: '提交申訴', id: 'i3xGD8' })}
          </Button>
        </div>
      }
    >
      <Container className="flex-1 overflow-y-auto">
        <div className="mt-4 px-4 text-[#3D3A50] font-bold">
          {intl.formatMessage({ defaultMessage: '申訴理由', id: 'htEymu' })}
        </div>
        <div className="py-4 px-4 border-b">
          <Radio.Group value={reason} onChange={(v) => setReason(v as string)}>
            <Space direction="vertical">
              {data?.data?.map((v, i) => (
                <Radio key={i} value={v}>
                  {v}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <div className="mt-4 px-4 text-[#3D3A50] font-bold">
          <span>{intl.formatMessage({ defaultMessage: '申訴截圖(可選)', id: 'ZOabtQ' })}</span>
          <div className="mt-4 flex">
            <ImagePicker
              onChange={(e) => {
                if (e.target.files) {
                  const formData = new FormData();
                  formData.append('imageFiles', e.target.files[0]);

                  uploadImage(formData).then((res: any) => {
                    setImage1Url(res.data.data?.imageUrlList?.[0]);
                  });
                }
              }}
            >
              <div className="w-20 h-20 bg-[#F7F7F7] flex items-center justify-center text-xl font-bold">
                {image1Url ? <img alt="" src={image1Url} className="w-full h-full" /> : '+'}
              </div>
            </ImagePicker>

            <ImagePicker
              onChange={(e) => {
                if (e.target.files) {
                  const formData = new FormData();
                  formData.append('imageFiles', e.target.files[0]);

                  uploadImage(formData).then((res: any) => {
                    setImage2Url(res.data.data?.imageUrlList?.[0]);
                  });
                }
              }}
            >
              <div className="w-20 h-20 bg-[#F7F7F7] flex items-center justify-center text-xl font-bold ml-4">
                {image2Url ? <img alt="" src={image2Url} className="w-full h-full" /> : '+'}
              </div>
            </ImagePicker>
          </div>
        </div>

        <div className="mt-4 px-4 text-[#3D3A50] font-bold">
          <span>{intl.formatMessage({ defaultMessage: '申訴留言(可選)', id: 'GFzduc' })}</span>
          <TextArea
            value={content}
            onChange={setContent}
            className="border rounded text-sm h-28 mt-4 p-2"
            placeholder={intl.formatMessage({
              defaultMessage: '您可以寫下您申訴的詳細情況～～（限300字）',
              id: 'w2IUbz',
            })}
            maxLength={300}
          />
        </div>

        <div className="mt-4 mx-4 p-4 flex flex-col text-xs border border-dashed text-[#6175AE] border-[#6175AE] bg-[#f1f3ff]">
          <div className="flex items-center">
            <SvgAlert />
            <span className="ml-2">
              {intl.formatMessage({
                defaultMessage: '申訴提醒',
                id: '/+9l+X',
              })}
            </span>
          </div>
          <span className="mt-2">
            {intl.formatMessage({
              defaultMessage:
                '提起申訴後資產將會凍結，申訴專員將介入本次交易，直至申訴結束。惡意申訴屬於擾亂平台正常運營秩序的行為，情節嚴重將凍結賬戶。',
              id: '/nvKfb',
            })}
          </span>
        </div>
      </Container>

      <OtcAppealAlertDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => {
          otcSubmitAppeal.mutate({
            data: {
              orderId: orderId ?? '',
              message: content,
              reason,
              image1Url,
              image2Url,
            },
          });
        }}
      />
    </Screen>
  );
};

const Container = styled.div`
  .adm-radio {
    --icon-size: 14px;
    --font-size: 12px;
    --gap: 6px;
  }
`;

export default OtcAppeal;
