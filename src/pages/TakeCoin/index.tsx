import { Button, Dialog, Input, Popup, Selector, Toast } from 'antd-mobile';
import { DownFill, RightOutline } from 'antd-mobile-icons';
import currency from 'currency.js';
import md5 from 'js-md5';
import { stringify } from 'query-string';
import { useState, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { withDefault, StringParam, useQueryParam } from 'use-query-params';
import {
  useAddressList,
  useGetCoinList,
  useGetWithdrawConfigs,
  useWithdrawSubmit,
} from '../../api/endpoints/transformer';
import { Address } from '../../api/model';
import PaymentPasswordDialog from '../../components/PaymentPasswordDialog';

import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
import CoinSymbolSelectDialog from '../RechargeCoin/CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');

const TakeCoin = () => {
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [chainType, setChainType] = useQueryParam('chainType', StringParam);
  const [openSymbol, setOpenSymbol] = useState(false);

  const [open, setOpen] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);

  const history = useHistory();

  const { data: configs } = useGetWithdrawConfigs({ symbol: symbol });

  const { data: coinList } = useGetCoinList(
    {
      inOut: -1,
    },
    {
      query: {
        onSuccess(data) {
          if (data.code === '200') {
            setChainType(data.data?.chainTypeList?.[0], 'replaceIn');
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

  const intl = useIntl();

  const { userInfo } = useAuthStore();
  const location = useLocation();

  const withdrawSubmit = useWithdrawSubmit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(intl.formatMessage({ defaultMessage: '申請成功提交', id: 'vo78d9' }));
          history.replace('/home/account');
          return;
        }

        if (data.code === '40090') {
          Dialog.confirm({
            content: intl.formatMessage({ defaultMessage: '未通過實名認證', id: 'ZJkNVt' }),
            confirmText: intl.formatMessage({ defaultMessage: '去實名', id: '0vdo6W' }),
            onConfirm() {
              history.push({ pathname: '/verified', state: { from: location } });
            },
          });
          return;
        }

        if (Number(data.code) === 40031) {
          Dialog.confirm({
            content: intl.formatMessage({ defaultMessage: '未設置交易密碼', id: 'Ck6JdO' }),
            confirmText: intl.formatMessage({ defaultMessage: '去設置', id: 'COl7RF' }),
            onConfirm() {
              if (userInfo?.phone) {
                history.push('/setting-pay-password');
              } else {
                history.push({ pathname: '/bind-phone', search: stringify({ type: 2 }) });
              }
            },
          });
          return;
        } else {
          Toast.show(data.msg);
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!address) {
      Toast.show(intl.formatMessage({ defaultMessage: '請選擇提幣地址', id: 'EZtA6l' }));
      return;
    }
    if (!amount || !amount.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入提幣數量', id: 'KuONpk' }));
      return;
    }
    if (Number(amount) < Number(configs?.data?.fee)) {
      Toast.show(intl.formatMessage({ defaultMessage: '提幣數量不足', id: '91nAu+' }));
      return;
    }

    if (!userInfo?.phone) {
      history.push({ pathname: '/bind-phone', search: stringify({ type: 2 }) });
      return;
    }

    Dialog.confirm({
      content: (
        <div>
          <div>
            {intl.formatMessage({ defaultMessage: '提幣幣種: ', id: 'm6ypg2' })}
            {symbol}
          </div>
          <div>
            {intl.formatMessage({ defaultMessage: '提幣數量: ', id: 'tY3163' })}
            {(amount ?? '0.00000000') + symbol}
          </div>
          <div>
            {intl.formatMessage({
              defaultMessage: '確認前請仔細核對提幣地址信息，以避免造成不必要的財產損失。',
              id: 'A53KYY',
            })}
          </div>
        </div>
      ),
      confirmText: intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' }),
      onConfirm() {
        setOpen(true);
      },
    });
  }, [address, amount, configs?.data?.fee, intl, userInfo?.phone, symbol, history]);

  const { data: addressList } = useAddressList({
    symbol: symbol,
    chainType: symbol === 'USDT' ? chainType ?? '' : '',
  });

  const precision = useMemo(
    () => configs?.data?.availableAmount?.split('.')[1].length || 8,
    [configs?.data?.availableAmount],
  );

  const account = useMemo(() => {
    const fee = Number(configs?.data?.fee);

    if (amount && Number(amount) >= fee) {
      return currency(Number(amount) - fee, {
        separator: '',
        symbol: '',
        precision,
      }).format();
    }
    return '--';
  }, [amount, configs?.data?.fee, precision]);
  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}
      right={
        <Link to="/take-coin-history">
          {intl.formatMessage({ defaultMessage: '记录', id: 'YvriPY' })}
        </Link>
      }
    >
      <Container className="p-4 bg-[#F4F6F4] flex-1 overflow-y-auto">
        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white">
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>
              {intl.formatMessage({ defaultMessage: '可用餘額', id: 'XNz8uP' })}({symbol})
            </span>
            <span className="text-[#3E4660] text-lg">
              {configs?.data?.availableAmount ?? '0.00'}
            </span>
          </div>
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>
              {intl.formatMessage({ defaultMessage: '凍結金額', id: '3gspHW' })}({symbol})
            </span>
            <span className="text-[#F32A44] text-lg">{configs?.data?.frozenAmount ?? '0.00'}</span>
          </div>
        </div>

        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white mt-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#3E4660]">
                {intl.formatMessage({ defaultMessage: '選擇幣種', id: 'jJ0rDY' })}
              </span>
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
              <div className="text-right ml-2">
                <span className="text-[#3E4660]">
                  {intl.formatMessage({ defaultMessage: '選擇充幣網絡', id: '8Pdrch' })}
                </span>
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
              <span>{intl.formatMessage({ defaultMessage: '提幣地址', id: 'NUeill' })}</span>
              <Link to="/addresses" className="text-[#00BAB8]">
                {intl.formatMessage({ defaultMessage: '提幣地址管理', id: 'OTiy6F' })}
              </Link>
            </div>

            <a
              className="mt-4 flex items-center bg-[#EDF3FA] px-2.5"
              onClick={() => setOpenAddress(true)}
            >
              <div className="h-11 flex-1 flex items-center">
                {address?.address ??
                  intl.formatMessage({ defaultMessage: '請選擇地址', id: 'l+7dfj' })}
              </div>
              <RightOutline fontSize={16} />
            </a>

            <div className="mt-4 bg-[#F6F7F9] p-4 rounded-xl text-xs text-[#6175AE] leading-6">
              {intl.formatMessage({
                defaultMessage:
                  '為保障資金安全，當您帳戶安全策略變更、密碼修改、使用新地址提幣，我們會對提幣進行人工審核，請耐心等待工作人員電話或郵件聯繫。',
                id: 'ldyl/D',
              })}
              <br />
              {intl.formatMessage({
                defaultMessage: '請務必確認電腦及瀏覽器安全，防止信息被篡改或洩露。',
                id: 'sCpxK3',
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white mt-4">
          <div className="text-[#A2A9BC] text-xs">
            {intl.formatMessage({
              defaultMessage: '提幣數量',
              id: 'wbTfN9',
            })}
          </div>
          <Input
            type="number"
            min={Number(configs?.data?.fee ?? 0)}
            maxLength={18}
            className="mt-2.5 h-11 bg-[#F6F7F9] px-2.5"
            placeholder={intl.formatMessage({
              defaultMessage: '输入提币数量',
              id: 'rQ+HPv',
            })}
            value={amount}
            onChange={setAmount}
          />

          <div className="text-sm mt-4 flex items-center justify-between">
            <span className="text-[#A2A9BC]">
              {intl.formatMessage({
                defaultMessage: '手續費',
                id: 'UXyFaa',
              })}
              ({symbol})
            </span>
            <span className="text-base text-[#6175AE]">
              {currency(configs?.data?.fee || 0, { precision, separator: '', symbol: '' }).format()}
            </span>
          </div>

          <div className="text-sm mt-2 flex items-center justify-between">
            <span className="text-[#A2A9BC]">
              {intl.formatMessage({
                defaultMessage: '到賬數量',
                id: 'zldodU',
              })}
              ({symbol})
            </span>
            <span className="text-base text-[#6175AE]">{account}</span>
          </div>

          <div className="mt-4">
            <Button
              block
              className="btn-purple "
              onClick={handleFinish}
              loading={withdrawSubmit.isLoading}
            >
              {intl.formatMessage({
                defaultMessage: '提币',
                id: '42lXMM',
              })}
            </Button>
          </div>
        </div>
      </Container>

      <PaymentPasswordDialog
        open={open}
        onClose={() => setOpen(false)}
        onFill={(value) => {
          withdrawSubmit.mutate({
            data: {
              amount,
              addressId: address?.id,
              payPass: md5(value),
            },
          });
        }}
      />

      <CoinSymbolSelectDialog
        symbols={coinList?.data?.coinList}
        open={openSymbol}
        onClose={() => setOpenSymbol(false)}
        defaultValue={symbol}
        onSelect={(value) => {
          setOpenSymbol(false);
          setSymbol(value, 'replaceIn');
          if (value === 'USDT') {
            setChainType(coinList?.data?.chainTypeList?.[0], 'replaceIn');
          }
        }}
      />

      <Popup visible={openAddress} position="right">
        <Screen
          headerTitle={intl.formatMessage({
            defaultMessage: '提幣地址管理',
            id: 'OTiy6F',
          })}
          navBarProps={{
            onBack() {
              setOpenAddress(false);
            },
          }}
        >
          <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
            <div className="text-[#3E4660] text-sm mb-4">
              {intl.formatMessage({
                defaultMessage: '我的提幣地址',
                id: '7rLwaw',
              })}
            </div>

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
                    {intl.formatMessage({
                      defaultMessage: '備注',
                      id: 'Be30m1',
                    })}
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
