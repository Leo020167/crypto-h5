import { Button, Form, Input, Toast } from 'antd-mobile';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentityGet, useIdentitySubmit } from '../../api/endpoints/transformer';
import aPng from '../../assets/a.png';
import addPng from '../../assets/add.png';
import bPng from '../../assets/b.png';
import Screen from '../../components/Screen';
import { uploadImage } from '../../utils/upload';
/**
 * 实名认证
 * @returns
 */
const Verified = () => {
  const ref = useRef<HTMLInputElement>(null);

  const keyRef = useRef<string>();

  const selectImage = useCallback((key: string) => {
    if (ref.current) {
      keyRef.current = key;
      ref.current.value = '';
      ref.current.click();
    }
  }, []);

  const [name, setName] = useState<string>();
  const [cardNo, setCardNo] = useState<string>();
  const [frontImgFile, setFrontImgFile] = useState<string>();
  const [backImgFile, setBackImgFile] = useState<string>();

  const navigate = useNavigate();

  const { data } = useIdentityGet({
    query: {
      onSuccess(data) {
        if (data.data?.identityAuth) {
          const identityAuth = data.data.identityAuth;
          setName(identityAuth.name);
          setCardNo(identityAuth.certNo);
          setFrontImgFile(identityAuth.frontImgUrl);
          setBackImgFile(identityAuth.backImgUrl);
        }
      },
    },
  });

  const identitySubmit = useIdentitySubmit({
    mutation: {
      onSuccess(data) {
        if (data.code) {
          Toast.show(data.msg);
          navigate({ pathname: '/my' }, { replace: true });
        }
      },
    },
  });
  const handleFinish = useCallback(() => {
    if (!name || !name.trim().length) {
      Toast.show('請輸入證件姓名');
      return;
    }
    if (!cardNo || !cardNo.trim().length) {
      Toast.show('請輸入身份證號碼');
      return;
    }
    if (!frontImgFile || !frontImgFile.trim().length) {
      Toast.show('請上傳人像照');
      return;
    }
    if (!backImgFile || !backImgFile.trim().length) {
      Toast.show('請上傳國徽照');
      return;
    }

    identitySubmit.mutate({
      data: {
        frontImgUrl: frontImgFile,
        backImgUrl: backImgFile,
        certNo: cardNo,
        name,
      },
    });
  }, [backImgFile, cardNo, frontImgFile, identitySubmit, name]);

  const identityAuth = useMemo(() => data?.data?.identityAuth, [data?.data?.identityAuth]);

  const isValid = useMemo(
    () => identityAuth?.state === '0' || identityAuth?.state === '1',
    [identityAuth?.state],
  );

  return (
    <Screen
      headerTitle="实名认证"
      footer={
        <div className="p-4">
          <Button
            block
            color="primary"
            onClick={handleFinish}
            loading={identitySubmit.isLoading}
            disabled={isValid}
          >
            完成
          </Button>
        </div>
      }
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
              if (keyRef.current === 'a') {
                setFrontImgFile(res.data.data?.imageUrlList?.[0]);
              } else {
                setBackImgFile(res.data.data?.imageUrlList?.[0]);
              }
            });
          }
        }}
      />

      {!!data?.data?.identityAuth && (
        <div className="text-xs py-1 px-4 bg-[#FE5400] text-white">
          {`狀態: ${identityAuth?.stateDesc} ${
            !isValid ? `(參數錯誤: ${identityAuth?.checkMsg})` : ''
          }`}
        </div>
      )}

      <div className="h-full flex flex-col overflow-y-auto">
        <div className=" border-l-4 border-[#fa4b1b] px-2.5 mx-4 mt-4 text-base">輸入證件資訊</div>
        <Form className="mt-2.5 px-4">
          <Form.Item>
            <Input
              placeholder="請輸入證件姓名"
              value={name}
              onChange={setName}
              readOnly={isValid}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="請輸入證件號"
              value={cardNo}
              onChange={setCardNo}
              readOnly={isValid}
            />
          </Form.Item>
        </Form>

        <div className="border-l-4 border-[#fa4b1b] px-2.5 mx-4 mt-4 text-base">輸入證件資訊</div>

        <div className="flex items-center justify-center flex-col">
          <div>
            <div className="w-72 mt-10 relative flex items-center justify-center">
              <img alt="" src={frontImgFile ?? aPng} className="w-full" />
              {!isValid && (
                <a
                  className="absolute"
                  onClick={() => {
                    selectImage('a');
                  }}
                >
                  <img alt="" src={addPng} className="w-20" />
                </a>
              )}
            </div>
            <div className="text-base mt-4 text-[#232323]">選擇正面</div>
          </div>

          <div>
            <div className="w-72 mt-10 relative flex items-center justify-center">
              <img alt="" src={backImgFile ?? bPng} className="w-full" />
              {!isValid && (
                <a
                  className="absolute"
                  onClick={() => {
                    selectImage('b');
                  }}
                >
                  <img alt="" src={addPng} className="w-20" />
                </a>
              )}
            </div>
            <div className="text-base mt-4 text-[#232323]">選擇反面</div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default Verified;
