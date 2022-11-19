import { Input } from 'antd-mobile';
import { useRef } from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { AXIOS_UPLOAD_INSTANCE } from '../../api/mutator/custom-instance';
import Screen from '../../components/Screen';

const Recharge = () => {
  const [chainType] = useQueryParam('chainType', StringParam);

  const ref = useRef<HTMLInputElement>(null);
  // TODO 上传
  return (
    <Screen
      headerTitle="充值"
      navBarProps={{
        right: <a>提交</a>,
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
            AXIOS_UPLOAD_INSTANCE.post('/upload/file.do');
          }
        }}
      />
      <div className="flex flex-col">
        <div className="p-4">
          <InputWrapper
            type="number"
            className="h-11 text-black px-2.5 bg-[#e6e6e6] rounded-md"
            placeholder="請輸入充值金額"
          />
        </div>

        <a
          className="p-16 text-center text-[#00C8FF]"
          onClick={() => {
            ref.current?.click();
          }}
        >
          點擊此處
          <br />
          上傳充值截圖
        </a>

        <div className="w-64 h-64 mt-6 self-center">
          <img alt="" className="w-full h-full" />
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
