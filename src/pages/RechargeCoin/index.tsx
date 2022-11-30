import { Button, Input, Selector, Toast } from 'antd-mobile';
import { AddOutline, DownFill } from 'antd-mobile-icons';
import { find } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import {
  useChargeSubmit,
  useDepositWithdrawGetInfo,
  useGetChargeConfigs,
} from '../../api/endpoints/transformer';
import ImagePicker from '../../components/ImagePicker';
import Screen from '../../components/Screen';
import { uploadImage } from '../../utils/upload';
import CoinSymbolSelectDialog from './CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');
const RechargeCoin = () => {
  const [chainType, setChainType] = useQueryParam('chainType', StringParam);
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [openSymbol, setOpenSymbol] = useState(false);

  const history = useHistory();

  const { data } = useDepositWithdrawGetInfo({
    query: {
      enabled: symbol === 'USDT',
      onSuccess(data) {
        if (data.data?.infos) {
          setChainType(data.data?.infos[0].type ?? '', 'replaceIn');
        }
      },
    },
  });

  const [amount, setAmount] = useState<string>();

  const { data: chargeConfigs } = useGetChargeConfigs(
    { symbol },
    {
      query: {
        enabled: !!symbol,
        onSuccess(data) {
          if (data.code === '200') {
            setAmount(data.data?.minChargeAmount);
          }
        },
      },
    },
  );

  const options = useMemo(
    () =>
      data?.data?.infos?.map((v) => ({
        value: v.type ?? '',
        label: v.type ? v.type : '--',
      })) ?? [],
    [data?.data?.infos],
  );

  const addressList = useMemo(
    () => chargeConfigs?.data?.addressList ?? [],
    [chargeConfigs?.data?.addressList],
  );

  const currentAddress = useMemo(() => {
    return find(addressList, (v) => {
      if (symbol === 'USDT') {
        return v.chainTpe === chainType && v.symbol === symbol;
      }
      return v.symbol === symbol;
    });
  }, [addressList, chainType, symbol]);

  const [, copyToClipboard] = useCopyToClipboard();

  const [image, setImage] = useState<string>();

  const chargeSubmit = useChargeSubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show('提交申請成功');
          history.goBack();
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

    chargeSubmit.mutate({
      data: {
        amount,
        address: currentAddress?.address ?? '',
        image,
        symbol: symbol,
        chainType: chainType ?? '',
      },
    });
  }, [amount, image, chargeSubmit, currentAddress?.address, symbol, chainType]);

  return (
    <Screen
      headerTitle="充幣"
      navBarProps={{
        right: <Link to="/take-coin-history">记录</Link>,
      }}
    >
      <Container className="p-4 bg-[#F4F6F4] flex-1 overflow-y-auto">
        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white">
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>可用餘額（USDT）</span>
            <span className="text-[#3E4660] text-lg">
              {chargeConfigs?.data?.availableAmount ?? '0.00'}
            </span>
          </div>
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>最小充值金額（USDT）</span>
            <span className="text-[#00BAB8] text-lg">
              {chargeConfigs?.data?.minChargeAmount ?? '0.00'}
            </span>
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

          <div className="flex items-center justify-center mt-8">
            <div className="w-[180px] h-[180px]">
              {currentAddress?.qrcode && (
                <img alt="" src={currentAddress?.qrcode} className="w-full h-full" />
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <span className="bg-[#6175AE] text-white rounded-2xl px-3 py-2 text-xs">
              只允許充值{symbol}
            </span>
          </div>

          <div className="mt-12 text-sm text-[#3E4660] flex justify-between">
            <span>充幣地址</span>
            {symbol === 'USDT' && (
              <span>
                當前鏈路：<span className="text-[#00BAB8]">{chainType}</span>
              </span>
            )}
          </div>

          <div className="mt-4 relative flex items-center">
            <div className="flex items-center h-11 bg-[#EDF3FA] text-[#6175AE] px-2.5 rounded-md overflow-x-auto pr-12 w-full">
              {currentAddress?.address}
            </div>
            {currentAddress?.address && (
              <a
                className="absolute right-[-4px] h-8 bg-[#6175AE] text-white pl-2.5 pr-2 flex items-center text-sm rounded-tl-[14px] rounded-bl-[14px]  rounded-tr-md rounded-br-md"
                onClick={() => {
                  if (currentAddress?.address) {
                    copyToClipboard(currentAddress?.address);
                    Toast.show('已複製到粘貼板');
                  }
                }}
              >
                複製
              </a>
            )}
          </div>
        </div>

        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white mt-4">
          <div>
            <span className="text-xs text-[#A2A9BC]">充值數量</span>
            <Input
              type="number"
              maxLength={18}
              className="h-12 bg-[#F6F7F9] mt-2 px-5"
              min={Number(chargeConfigs?.data?.minChargeAmount ?? 0)}
              value={amount}
              onChange={setAmount}
            />
          </div>

          <div className="mt-4">
            <span className="text-xs text-[#A2A9BC]">充值數量</span>

            <div className="mt-1">
              <ImagePicker
                onChange={(e) => {
                  if (e.target.files) {
                    const formData = new FormData();
                    formData.append('imageFiles', e.target.files[0]);

                    uploadImage(formData).then((res: any) => {
                      setImage(res.data.data?.imageUrlList?.[0]);
                    });
                  }
                }}
              >
                <div className="w-28 h-28 bg-[#F6F7F9] flex items-center justify-center text-xl font-bold">
                  {image ? (
                    <img alt="" src={image} className="w-full h-full" />
                  ) : (
                    <AddOutline fontSize={30} color="#C9CDD4" />
                  )}
                </div>
              </ImagePicker>
            </div>
          </div>

          <Button
            className="btn-purple mt-5"
            onClick={handleFinish}
            block
            loading={chargeSubmit.isLoading}
          >
            充值確認
          </Button>
        </div>

        <CoinSymbolSelectDialog
          open={openSymbol}
          onClose={() => setOpenSymbol(false)}
          defaultValue={symbol}
          onSelect={(value) => {
            setOpenSymbol(false);
            setSymbol(value, 'replaceIn');
          }}
        />
      </Container>
    </Screen>
  );
};

const Container = styled.div`
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

export default RechargeCoin;
