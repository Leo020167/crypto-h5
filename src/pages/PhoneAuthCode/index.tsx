import { Button, Input, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { withDefault, NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useSmsGet, useUserSecurityCheckIdentity } from '../../api/endpoints/transformer';

import Screen from '../../components/Screen';
import SwipeImageValidator from '../../components/SwipeImageValidator';
import { useAuthStore } from '../../stores/auth';

const TypeParam = withDefault(NumberParam, 0);

const PhoneAuthCode = () => {
  const [type] = useQueryParam('type', TypeParam);
  const [email, setEmail] = useQueryParam('email', StringParam);
  const [phone] = useQueryParam('phone', StringParam);
  const [redirectUrl] = useQueryParam('redirectUrl', StringParam);

  const { userInfo } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [openVerityPhone, setOpenVerityPhone] = useState(false);

  const smsGet = useSmsGet();

  const intl = useIntl();

  const handleImageValidator = useCallback(
    (locationx: number, dragImgKey: string) => {
      Toast.show(intl.formatMessage({ defaultMessage: '獲取成功', id: '672nEV' }));

      smsGet.mutate({
        data: {
          locationx,
          dragImgKey,
          type: phone ? 1 : 2,
          countryCode: userInfo?.countryCode ?? '',
          sendAddr: phone ?? email ?? '',
        },
      });
    },
    [email, intl, phone, smsGet, userInfo?.countryCode],
  );

  const [code, setCode] = useState<string>();

  const history = useHistory();

  const userSecurityCheckIdentity = useUserSecurityCheckIdentity({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          if (type === 1) {
            // 继续验证邮箱
            if (email) {
              setEmail(email, 'replace');
            } else {
              history.push({
                pathname: '/bind-email',
                search: stringify({ type: 1, redirectUrl }),
              });
            }
          } else {
            Toast.show(data.msg);
            // TODO 重定向回去
          }
        }
      },
    },
  });

  const check = useCallback(
    (locationx: number, dragImgKey: string) => {
      userSecurityCheckIdentity.mutate({
        data: {
          phone: phone ?? '',
          smsCode: code ?? '',
          dragImgKey,
          locationx,
        },
      });
    },
    [code, phone, userSecurityCheckIdentity],
  );

  const handleFinish = useCallback(() => {
    if (!code || !code.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入短信驗證碼', id: '+2zznO' }));
      return;
    }

    if (phone) {
      setOpenVerityPhone(true);
    } else {
      // TODO 邮箱
    }
  }, [code, intl, phone]);

  return (
    <Screen
      headerTitle={
        phone
          ? intl.formatMessage({ defaultMessage: '短信驗證碼', id: 'C8HXvQ' })
          : intl.formatMessage({ defaultMessage: '郵箱驗證碼', id: '56o47p' })
      }
    >
      <Container>
        <div className="mt-16 text-[#666666] text-center">
          {phone
            ? intl.formatMessage(
                { defaultMessage: '驗證碼已發送至，{phone}', id: 'qTCfxl' },
                { phone },
              )
            : intl.formatMessage(
                { defaultMessage: '驗證碼已發送至，{email}', id: 'Jgy7GK' },
                { email },
              )}
        </div>
        <div className="p-4">
          <Input
            value={code}
            onChange={setCode}
            className="border h-10 px-3 border-slate-700 rounded text-sm"
            placeholder={intl.formatMessage({ defaultMessage: '請輸入驗證碼', id: 'Bzq9W2' })}
          />
        </div>

        <div className="p-4">
          <Button block onClick={handleFinish}>
            {intl.formatMessage({ defaultMessage: '下一步', id: '6Y0p2/' })}
          </Button>
        </div>
      </Container>

      <SwipeImageValidator
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleImageValidator}
      />
      <SwipeImageValidator
        key="phone"
        open={openVerityPhone}
        onClose={() => setOpenVerityPhone(false)}
        onSuccess={check}
      />
    </Screen>
  );
};

const Container = styled.div`
  .adm-input-element {
    font-size: 14px;
  }

  .adm-button {
    background-color: #ff6b1b;
    color: #fff;
  }
`;

export default PhoneAuthCode;
