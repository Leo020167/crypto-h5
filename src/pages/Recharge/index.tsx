import { Input, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useDepositWithdrawLocalSubmit } from '../../api/endpoints/transformer';
import { userAtom } from '../../atoms';
import Screen from '../../components/Screen';
import { uploadImage } from '../../utils/upload';

const Recharge = () => {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [chainType] = useQueryParam('chainType', StringParam);

  const ref = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState<string>();
  const [image, setImage] = useState<string>();

  const depositWithdrawLocalSubmit = useDepositWithdrawLocalSubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show('提交申請成功');
          navigate('/recharge-coin', { replace: true });
        } else {
          Toast.show(data.msg);
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!amount || !amount.trim().length) {
      Toast.show('請輸入充值金額');
      return;
    }

    if (!image) {
      Toast.show('請先上傳充值截圖');
      return;
    }

    depositWithdrawLocalSubmit.mutate({
      data: {
        userId: user?.userId,
        amount,
        address: '',
        image,
        inOut: '1',
        chainType: chainType ?? '',
      },
    });
  }, [amount, chainType, depositWithdrawLocalSubmit, image, user?.userId]);

  return (
    <Screen
      headerTitle="充值"
      navBarProps={{
        right: <a onClick={handleFinish}>提交</a>,
      }}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            const formData = new FormData();
            formData.append('imageFiles', e.target.files[0]);

            uploadImage(formData).then((res: any) => {
              setImage(res.data.data?.imageUrlList?.[0]);
            });
          }
        }}
      />

      <div className="flex flex-col">
        <div className="p-4">
          <InputWrapper
            value={amount}
            onChange={setAmount}
            type="number"
            className="h-11 text-black px-2.5 bg-[#e6e6e6] rounded-md"
            placeholder="請輸入充值金額"
          />
        </div>

        <div className="p-16 text-center text-[#00C8FF]">
          <a
            onClick={() => {
              if (ref.current) {
                ref.current.value = '';
                ref.current.click();
              }
            }}
          >
            點擊此處
            <br />
            上傳充值截圖
          </a>
        </div>

        <div className="w-64 h-64 mt-6 self-center">
          {image && <img alt="" src={image} className="w-full h-full" />}
        </div>
      </div>
    </Screen>
  );
};

const InputWrapper = styled(Input)`
  input {
    font-size: 14px;
    ::placeholder {
      color: #8d8d8d;
    }
  }
`;

export default Recharge;
