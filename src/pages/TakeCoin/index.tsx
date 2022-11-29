import { Button, Dialog, Input, Selector, Toast } from 'antd-mobile';
import { DownFill, RightOutline } from 'antd-mobile-icons';
import { useAtomValue } from 'jotai';
import { first } from 'lodash-es';
import { stringify } from 'query-string';
import { useState, useMemo, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { withDefault, StringParam, useQueryParam } from 'use-query-params';
import {
  useDepositWithdrawGetInfo,
  useDepositWithdrawLocalSubmit,
} from '../../api/endpoints/transformer';
import { userAtom } from '../../atoms';
import Screen from '../../components/Screen';
import { uploadImage } from '../../utils/upload';
import CoinSymbolSelectDialog from '../RechargeCoin/CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');
const TakeCoin = () => {
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [chainType, setChainType] = useQueryParam('chainType', StringParam);
  const [openSymbol, setOpenSymbol] = useState(false);

  const history = useHistory();

  const user = useAtomValue(userAtom);
  const location = useLocation();

  const isAuthTakeCoin = location.state?.success ?? false;

  const [selected, setSelected] = useState<string[]>([]);

  const { data } = useDepositWithdrawGetInfo({
    query: {
      enabled: !!user?.userId,
      onSuccess(data) {
        if (data.data?.infos) {
          setSelected([data.data?.infos[0].type ?? '']);
        }
      },
    },
  });

  const items = useMemo(() => data?.data?.infos ?? [], [data?.data?.infos]);

  const options = useMemo(
    () =>
      items.map((v) => ({
        value: v.type ?? '',
        label: v.type ?? '--',
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

  const depositWithdrawLocalSubmit = useDepositWithdrawLocalSubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show('申請成功提交');
        }
      },
    },
  });

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
      Dialog.confirm({
        content: (
          <div>
            <div> 提幣幣種: USDT</div>
            <div>提幣數量: {(amount ?? '0.00000000') + 'USDT'}</div>
            <div>確認前請仔細核對提幣地址信息，以避免造成不必要的財產損失。</div>
          </div>
        ),
        confirmText: '确定',
        onConfirm() {
          depositWithdrawLocalSubmit.mutate({
            data: {
              userId: user?.userId,
              amount,
              address,
              image,
              inOut: '-1',
              chainType: selectedItem?.type ?? '',
            },
          });
        },
      });
    } else {
      //如果未通过手机验证
      if (user?.phone) {
        history.push({
          pathname: '/phone-auth-code',
          search: stringify({
            type: 1,
            phone: user?.phone,
            email: user?.email,
            redirectUrl: location.pathname,
          }),
        });
      } else {
        history.push('/bind-phone');
      }
    }
  }, [
    address,
    amount,
    depositWithdrawLocalSubmit,
    history,
    image,
    isAuthTakeCoin,
    location.pathname,
    selectedItem?.fee,
    selectedItem?.type,
    user?.email,
    user?.phone,
    user?.userId,
  ]);

  return (
    <Screen headerTitle="提币" right={<Link to="/take-coin-history">记录</Link>}>
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
      <Container className="p-4 bg-[#F4F6F4] flex-1 overflow-y-auto">
        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white">
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>可用餘額（USDT）</span>
            <span className="text-[#3E4660] text-lg">{'0.00'}</span>
          </div>
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>凍結金額（USDT）</span>
            <span className="text-[#F32A44] text-lg">{'0.00'}</span>
          </div>
        </div>

        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white mt-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#3E4660]">選擇幣種</span>
              <div className="mt-4">
                <a
                  className="flex items-center justify-center border border-[#3E4660] rounded h-8 px-2"
                  onClick={() => {
                    setOpenSymbol(true);
                  }}
                >
                  {symbol}
                  <DownFill fontSize={8} className="ml-2" />
                </a>
              </div>
            </div>
            {symbol === 'USDT' && (
              <div className="text-right">
                <span className="text-[#3E4660]">選擇充幣網絡</span>
                <Selector
                  className="mt-4"
                  columns={3}
                  showCheckMark={false}
                  options={options}
                  value={[chainType ?? '']}
                  onChange={(value) => {
                    if (value.length) {
                      setChainType(value[0], 'replaceIn');
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-[#E2E4F0] mt-5"></div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span>提幣地址</span>
              <a className="text-[#00BAB8]">提幣地址管理</a>
            </div>

            <div className="mt-4 flex items-center bg-[#EDF3FA] px-2.5">
              <Input
                className=" h-11  "
                placeholder="输入或长按粘贴地址"
                value={address}
                onChange={setAddress}
              />
              <RightOutline fontSize={16} />
            </div>

            <div className="mt-4 bg-[#F6F7F9] p-4 rounded-xl text-xs text-[#6175AE] leading-6">
              為保障資金安全，當您帳戶安全策略變更、密碼修改、使用新地址提幣，我們會對提幣進行人工審核，請耐心等待工作人員電話或郵件聯繫。
              <br />
              請務必確認電腦及瀏覽器安全，防止信息被篡改或洩露。
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white mt-4">
          <div className="text-[#A2A9BC] text-xs">提幣數量</div>
          <Input
            type="number"
            maxLength={18}
            className="mt-2.5 h-11 bg-[#F6F7F9] px-2.5"
            placeholder="输入提币数量"
            value={amount}
            onChange={setAmount}
          />

          <div className="text-sm mt-4 flex items-center justify-between">
            <span className="text-[#A2A9BC]">手續費（USDT）</span>
            <span className="text-base text-[#6175AE]">0</span>
          </div>

          <div className="text-sm mt-2 flex items-center justify-between">
            <span className="text-[#A2A9BC]">到賬數量（USDT）</span>
            <span className="text-base text-[#6175AE]">0</span>
          </div>

          <Button block className="btn-purple mt-4" onClick={handleFinish}>
            提币
          </Button>
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
      </Container>

      <CoinSymbolSelectDialog
        open={openSymbol}
        onClose={() => setOpenSymbol(false)}
        defaultValue={symbol}
        onSelect={(value) => {
          setOpenSymbol(false);
          setSymbol(value, 'replaceIn');
        }}
      />
    </Screen>
  );
};

const Container = styled.div`
  .adm-input-element {
    font-size: 14px;
    ::placeholder {
      color: #a2a9bc;
    }
  }

  .adm-selector {
    --padding: 0 10px;
    .adm-selector-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      color: #00bab8;
      font-size: 16px;
      border: 1px solid #00bab8;
      background-color: transparent;
      &.adm-selector-item-active {
        color: #fff;
        background-color: #00bab8;
      }
    }
  }
`;

export default TakeCoin;
