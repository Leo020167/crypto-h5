import { Button, Form, Input, Toast } from 'antd-mobile';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
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

  const history = useHistory();

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

  const intl = useIntl();

  const identitySubmit = useIdentitySubmit({
    mutation: {
      onSuccess(data) {
        if (data.code) {
          Toast.show(data.msg);
          history.replace({ pathname: '/my' });
        }
      },
    },
  });
  const handleFinish = useCallback(() => {
    if (!name || !name.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入證件姓名', id: 'kEQh1G' }));
      return;
    }
    if (!cardNo || !cardNo.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入身份證號碼', id: 'UkiaYk' }));
      return;
    }
    if (!frontImgFile || !frontImgFile.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請上傳人像照', id: 'eD3Ul5' }));
      return;
    }
    if (!backImgFile || !backImgFile.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請上傳國徽照', id: '+ulzus' }));
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
  }, [backImgFile, cardNo, frontImgFile, identitySubmit, intl, name]);

  const identityAuth = useMemo(() => data?.data?.identityAuth, [data?.data?.identityAuth]);

  const isValid = useMemo(
    () => identityAuth?.state === '0' || identityAuth?.state === '1',
    [identityAuth?.state],
  );

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '实名认证', id: 'Yy75R8' })}
      footer={
        <div className="p-4">
          <Button
            block
            color="primary"
            onClick={handleFinish}
            loading={identitySubmit.isLoading}
            disabled={isValid}
          >
            {intl.formatMessage({ defaultMessage: '完成', id: 'uHUP9v' })}
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

      <div className="h-full flex flex-col overflow-y-auto">
        <div className=" border-l-4 border-[#fa4b1b] px-2.5 mx-4 mt-4 text-base">
          {intl.formatMessage({
            defaultMessage: '輸入證件資訊',
            id: 'U99CrO',
          })}
        </div>
        <Form className="mt-2.5 px-4">
          <Form.Item>
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '請輸入證件姓名',
                id: 'kEQh1G',
              })}
              value={name}
              onChange={setName}
              readOnly={isValid}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '請輸入證件號',
                id: 'MXqXyk',
              })}
              value={cardNo}
              onChange={setCardNo}
              readOnly={isValid}
            />
          </Form.Item>
        </Form>

        <div className="border-l-4 border-[#fa4b1b] px-2.5 mx-4 mt-4 text-base">
          {intl.formatMessage({
            defaultMessage: '輸入證件資訊',
            id: 'U99CrO',
          })}
        </div>

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
            <div className="text-base mt-4 text-[#232323]">
              {intl.formatMessage({
                defaultMessage: '選擇正面',
                id: 'Dq6c3S',
              })}
            </div>
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
            <div className="text-base mt-4 text-[#232323]">
              {' '}
              {intl.formatMessage({
                defaultMessage: '選擇反面',
                id: '5qldgM',
              })}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default Verified;
