import { Button, Input, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useState } from 'react';
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

  const handleImageValidator = useCallback(
    (locationx: number, dragImgKey: string) => {
      Toast.show('獲取成功');

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
    [email, phone, smsGet, userInfo?.countryCode],
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
      Toast.show('請輸入短信驗證碼');
      return;
    }

    if (phone) {
      setOpenVerityPhone(true);
    } else {
      // TODO 邮箱
    }
  }, [code, phone]);

  return (
    <Screen headerTitle={phone ? '短信驗證碼' : '郵箱驗證碼'}>
      <Container>
        <div className="mt-16 text-[#666666] text-center">
          {phone ? `驗證碼已發送至，${phone}` : `驗證碼已發送至，${email}`}
        </div>
        <div className="p-4">
          <Input
            value={code}
            onChange={setCode}
            className="border h-10 px-3 border-slate-700 rounded text-sm"
            placeholder="請輸入驗證碼"
          />
        </div>

        <div className="p-4">
          <Button block onClick={handleFinish}>
            下一步
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
