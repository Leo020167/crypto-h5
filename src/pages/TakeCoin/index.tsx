import { Button, Dialog, Input, Popup, Selector, Toast } from 'antd-mobile';
import { DownFill, RightOutline } from 'antd-mobile-icons';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useState, useMemo, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { withDefault, StringParam, useQueryParam } from 'use-query-params';
import {
  useAddressList,
  useGetCoinList,
  useGetWithdrawConfigs,
  useWithdrawSubmit,
} from '../../api/endpoints/transformer';
import { Address } from '../../api/model';
import { userAtom } from '../../atoms';
import Screen from '../../components/Screen';
import CoinSymbolSelectDialog from '../RechargeCoin/CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');

const TakeCoin = () => {
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [chainType, setChainType] = useQueryParam('chainType', StringParam);
  const [openSymbol, setOpenSymbol] = useState(false);

  const [openAddress, setOpenAddress] = useState(false);

  const history = useHistory();

  const user = useAtomValue(userAtom);

  const location = useLocation();

  const isAuthTakeCoin = location.state?.success ?? false;

  const { data: configs } = useGetWithdrawConfigs({ symbol: symbol });

  const { data: coinList } = useGetCoinList(
    {
      inOut: -1,
    },
    {
      query: {
        onSuccess(data) {
          if (data.code === '200') {
            setChainType(data.data?.chainTypeList?.[0]);
          }
        },
      },
    },
  );

  const options = useMemo(
    () =>
      coinList?.data?.chainTypeList?.map((v) => ({
        value: v,
        label: v,
      })) ?? [],
    [coinList?.data?.chainTypeList],
  );

  const [address, setAddress] = useState<Address>();
  const [amount, setAmount] = useState<string>();

  const withdrawSubmit = useWithdrawSubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show('申請成功提交');
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!address) {
      Toast.show('請選擇提幣地址');
      return;
    }
    if (!amount || !amount.trim().length) {
      Toast.show('請輸入提幣數量');
      return;
    }
    if (Number(amount) < Number(configs?.data?.fee)) {
      Toast.show('提幣數量不足');
      return;
    }

    if (isAuthTakeCoin) {
      Dialog.confirm({
        content: (
          <div>
            <div>提幣幣種: {symbol}</div>
            <div>提幣數量: {(amount ?? '0.00000000') + symbol}</div>
            <div>確認前請仔細核對提幣地址信息，以避免造成不必要的財產損失。</div>
          </div>
        ),
        confirmText: '确定',
        onConfirm() {
          withdrawSubmit.mutate({
            data: {
              amount,
              addressId: address?.id,
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
    configs?.data?.fee,
    isAuthTakeCoin,
    symbol,
    withdrawSubmit,
    user?.phone,
    user?.email,
    history,
    location.pathname,
  ]);

  const { data: addressList } = useAddressList({ symbol: symbol, chainType: chainType ?? '' });

  return (
    <Screen headerTitle="提币" right={<Link to="/take-coin-history">记录</Link>}>
      <Container className="p-4 bg-[#F4F6F4] flex-1 overflow-y-auto">
        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white">
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>可用餘額({symbol})</span>
            <span className="text-[#3E4660] text-lg">
              {configs?.data?.availableAmount ?? '0.00'}
            </span>
          </div>
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>凍結金額({symbol})</span>
            <span className="text-[#F32A44] text-lg">{configs?.data?.frozenAmount ?? '0.00'}</span>
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
              <Link to="/address-management" className="text-[#00BAB8]">
                提幣地址管理
              </Link>
            </div>

            <a
              className="mt-4 flex items-center bg-[#EDF3FA] px-2.5"
              onClick={() => setOpenAddress(true)}
            >
              <div className="h-11 flex-1 flex items-center">
                {address?.address ?? '請選擇地址'}
              </div>
              <RightOutline fontSize={16} />
            </a>

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
            min={Number(configs?.data?.fee ?? 0)}
            maxLength={18}
            className="mt-2.5 h-11 bg-[#F6F7F9] px-2.5"
            placeholder="输入提币数量"
            value={amount}
            onChange={setAmount}
          />

          <div className="text-sm mt-4 flex items-center justify-between">
            <span className="text-[#A2A9BC]">手續費({symbol})</span>
            <span className="text-base text-[#6175AE]">
              {Number(configs?.data?.fee ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="text-sm mt-2 flex items-center justify-between">
            <span className="text-[#A2A9BC]">到賬數量({symbol})</span>
            <span className="text-base text-[#6175AE]">
              {amount ? (Number(amount) - Number(configs?.data?.fee)).toFixed(2) : '0.00'}
            </span>
          </div>

          <Button block className="btn-purple mt-4" onClick={handleFinish}>
            提币
          </Button>
        </div>
      </Container>

      <CoinSymbolSelectDialog
        symbols={coinList?.data?.coinList}
        open={openSymbol}
        onClose={() => setOpenSymbol(false)}
        defaultValue={symbol}
        onSelect={(value) => {
          setOpenSymbol(false);
          setSymbol(value, 'replaceIn');
        }}
      />

      <Popup visible={openAddress} position="right">
        <Screen
          headerTitle="提幣地址管理"
          navBarProps={{
            onBack() {
              setOpenAddress(false);
            },
          }}
        >
          <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
            <div className="text-[#3E4660] text-sm mb-4">我的提幣地址</div>

            {addressList?.data?.map((v) => (
              <a
                key={v.id}
                className=" bg-white rounded-lg shadow-md shadow-black/5 px-5 py-4 flex items-center"
                onClick={() => {
                  setAddress(v);
                  setOpenAddress(false);
                }}
              >
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="text-[#6175AE] text-lg">{v.symbol}</div>
                  <div className="text-[#A2A9BC] text-xs mt-1 break-words">{v.address}</div>
                  <div className="text-[#A2A9BC] mt-2">
                    備注
                    <span className="text-[#3E4660] ml-1">{v.remark}</span>
                  </div>
                </div>
                <RightOutline fontSize={18} className=" ml-8" />
              </a>
            ))}
          </div>
        </Screen>
      </Popup>
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
