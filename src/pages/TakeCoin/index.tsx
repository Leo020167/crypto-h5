import { Button, Form, Input, InputRef, NavBar, Selector, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { first } from 'lodash-es';
import { stringify } from 'query-string';
import { useState, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDepositWithdrawGetInfo } from '../../api/endpoints/transformer';
import { isAuthTakeCoinAtom, userAtom } from '../../atoms';
import { uploadImage } from '../../utils/upload';

const TakeCoin = () => {
  const navigate = useNavigate();

  const user = useAtomValue(userAtom);
  const isAuthTakeCoin = useAtomValue(isAuthTakeCoinAtom);
  const [selected, setSelected] = useState<string[]>([]);

  const { data } = useDepositWithdrawGetInfo(
    { userId: user?.userId },
    {
      query: {
        enabled: !!user?.userId,
        onSuccess(data) {
          if (data.data?.infos) {
            setSelected([data.data?.infos[0].type ?? '']);
          }
        },
      },
    },
  );

  const items = useMemo(() => data?.data?.infos ?? [], [data?.data?.infos]);

  const options = useMemo(
    () =>
      items.map((v) => ({
        value: v.type ?? '',
        label: v.type ? 'USDT-' + v.type : '--',
      })) ?? [],
    [items],
  );

  const selectedItem = useMemo(
    () => first(items.filter((v) => selected.includes(v.type ?? ''))),
    [items, selected],
  );

  const [address, setAddress] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [image, setImage] = useState<string>();

  const ref = useRef<HTMLInputElement>(null);
  const inputRef = useRef<InputRef>(null);

  const handleFinish = useCallback(() => {
    if (!selectedItem?.type) {
      Toast.show('請選擇鍵類型');
      return;
    }
    if (!address || !address.trim().length) {
      Toast.show('請填寫提幣地址');
      return;
    }
    if (!amount || !amount.trim().length) {
      Toast.show('請輸入提幣數量');
      return;
    }
    if (Number(amount) < Number(selectedItem?.fee)) {
      Toast.show('提幣數量不足');
      return;
    }

    if (isAuthTakeCoin) {
      // TODO 弹窗提示金额，是否确定提现
    } else {
      //如果未通过手机验证
      if (user?.phone) {
        navigate(
          `/phone-auth-code?${stringify({
            type: 1,
          })}`,
        );
        // TODO PhoneAuthCode
      } else {
        navigate('/bind-phone');
      }
    }
  }, [
    address,
    amount,
    isAuthTakeCoin,
    navigate,
    selectedItem?.fee,
    selectedItem?.type,
    user?.phone,
  ]);

  return (
    <Container className="h-screen bg-white flex flex-col">
      <NavBar onBack={() => navigate(-1)} right={<Link to="/take-coin-history">记录</Link>}>
        提币
      </NavBar>

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

      <div className="px-4 flex-1 overflow-y-auto">
        <div className="mt-4">
          <div className="text-[#1D3155]">充值网络</div>
          <Selector
            className="mt-2"
            columns={3}
            showCheckMark={false}
            options={options}
            value={selected}
            onChange={setSelected}
          />
        </div>
        <div className="mt-2">
          <Form.Item label="提币地址">
            <Input
              className="address py-2"
              placeholder="输入或长按粘贴地址"
              value={address}
              onChange={setAddress}
            />
          </Form.Item>
        </div>
        <div className="mt-2">
          <div className=" h-32 flex items-center">
            <div className="flex-1 text-base">提币二维码</div>
            <div
              className="text-center text-[#00C8FF] h-full flex items-center"
              onClick={() => {
                if (ref.current) {
                  ref.current.value = '';
                  ref.current.click();
                }
              }}
            >
              {image ? (
                <img alt="" src={image} className="h-full w-full" />
              ) : (
                <a>
                  点击此处上传
                  <br />
                  提币二维码
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Form.Item label="数量">
            <Input
              ref={inputRef}
              maxLength={18}
              className="amount py-2"
              placeholder="输入提币数量"
              value={amount}
              onChange={setAmount}
            />
            <div className="absolute right-10 text-[#666175AE]">--</div>
            <a
              className="text-xs text-[#6175AE] absolute right-0"
              onClick={() => {
                setAmount(data?.data?.balance);
                ref.current?.focus();
              }}
            >
              全部
            </a>
          </Form.Item>
          <div className="text-[#666175AE] text-xs">
            可提币数量: {data?.data?.balance ?? '0.00'}
          </div>
        </div>

        <div>
          <Form.Item label="手续费">
            <Input
              type="number"
              readOnly
              className="amount py-2"
              value={selectedItem?.fee}
              maxLength={18}
            />
            <div className="absolute right-0 text-[#666175AE]">Token</div>
          </Form.Item>
        </div>
      </div>

      <div className="flex justify-between px-4 mb-4 pt-2.5">
        <span className="text-[#1D3155]">到账数量：</span>
        <span className="text-[#1D3155] font-bold">0.00000000</span>
      </div>

      <div className="px-4 mb-4">
        <Button block color="primary" onClick={handleFinish}>
          提币
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-selector-item {
    border: 1px solid #cccccc;

    color: #cccccc;
    background-color: transparent;
    &.adm-selector-item-active {
      border-color: #6175ae;
      color: #6175ae;
    }
  }

  .address,
  .amount {
    border-bottom: 1px solid #f0f0f0;
    color: #1d3155;
  }

  .amount {
    flex: 1;
  }

  .adm-form-item-child-inner {
    position: relative;
    display: flex;
    align-items: center;
  }

  .adm-list-item-title {
    .adm-form-item-label {
      color: #1d3155;
      font-size: 14px;
    }
  }
`;

export default TakeCoin;
