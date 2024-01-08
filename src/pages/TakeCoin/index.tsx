import { Button, Dialog, Input, Popup, Selector, Toast } from 'antd-mobile';
import { DownFill, RightOutline } from 'antd-mobile-icons';
import currency from 'currency.js';
import md5 from 'js-md5';
import { stringify } from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
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

  const [addressStr, setAddressStr] = useState<string>();
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
            cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
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
            cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
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
    if (!address && addressStr?.trim().length === 0) {
      Toast.show(intl.formatMessage({ defaultMessage: '請填寫提幣地址', id: 'Zy+yLo' }));
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

    // if (!userInfo?.phone) {
    //   history.push({ pathname: '/bind-phone', search: stringify({ type: 2 }) });
    //   return;
    // }

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
      cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
      confirmText: intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' }),
      onConfirm() {
        setOpen(true);
      },
    });
  }, [address, addressStr, amount, configs?.data?.fee, intl, symbol]);

  const { data: addressList } = useAddressList({
    symbol: symbol,
    chainType: symbol === 'USDT' ? chainType ?? '' : '',
  });

  const precision = useMemo(
    () => configs?.data?.availableAmount?.split('.')?.[1]?.length || 8,
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

  const auth = useAuthStore();
  const mounted = useRef(false);
  useEffect(() => {
    if (auth.userInfo?.payPass || mounted.current) return;

    mounted.current = true;
    Dialog.confirm({
      title: intl.formatMessage({ defaultMessage: '溫馨提示', id: 'TlP8cy' }),
      content: intl.formatMessage({
        defaultMessage: '爲了您的資金安全，請先設置【交易密碼】！',
        id: 'PmeCYZ',
      }),
      cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
      confirmText: intl.formatMessage({ defaultMessage: '設置', id: '+eQ50+' }),
      onConfirm() {
        history.push('/setting-pay-password');
      },
    });
  }, [auth.userInfo?.payPass, history, intl]);
  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}
      right={
        <Link to="/take-coin-history">
          {intl.formatMessage({ defaultMessage: '记录', id: 'YvriPY' })}
        </Link>
      }
    >
      <Container className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4 dark:bg-[#161720]">
        <div className="rounded-xl bg-white p-5 shadow-md shadow-black/5 dark:bg-[#2A2E38]">
          <div className="flex items-center justify-between text-sm text-[#A2A9BC] dark:text-[#AAAAAA]">
            <span>
              {intl.formatMessage(
                { defaultMessage: '可用餘額({symbol})', id: 'p4Oi3U' },
                { symbol },
              )}
            </span>
            <span className="text-lg text-[#3E4660] dark:text-white">
              {configs?.data?.availableAmount ?? '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#A2A9BC]">
            <span>
              {intl.formatMessage({ defaultMessage: '凍結金額', id: '3gspHW' })}({symbol})
            </span>
            <span className="text-lg text-[#F32A44] dark:text-[#D9BD93]">
              {configs?.data?.frozenAmount ?? '0.00'}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white p-5 shadow-md shadow-black/5 dark:bg-[#2A2E38]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[#3E4660] dark:text-[#AAAAAA]">
                {intl.formatMessage({ defaultMessage: '選擇幣種', id: 'jJ0rDY' })}
              </span>
              <span className="w-2/3 text-right text-[#3E4660] dark:text-[#AAAAAA]">
                {intl.formatMessage({ defaultMessage: '選擇充幣網絡', id: '8Pdrch' })}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-x-2">
              <a
                className="flex h-8 items-center justify-center rounded border border-[#3E4660] px-2"
                onClick={() => {
                  setOpenSymbol(true);
                }}
              >
                {symbol}
                <DownFill fontSize={8} className="ml-2" />
              </a>
              {symbol === 'USDT' && (
                <div className="text-right">
                  <Selector
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
          </div>

          <div className="mt-5 border-t border-dashed border-[#E2E4F0] dark:border-[#AAAAAA]"></div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm dark:text-[#AAAAAA]">
              <span>{intl.formatMessage({ defaultMessage: '提幣地址', id: 'NUeill' })}</span>
              <Link to="/addresses" className="text-[#00BAB8] dark:text-[#6175AE]">
                {intl.formatMessage({ defaultMessage: '提幣地址管理', id: 'OTiy6F' })}
              </Link>
            </div>

            <div className="mt-4 flex items-center rounded bg-[#EDF3FA] px-2.5 dark:bg-[#3D424E]">
              <div className="flex h-11 flex-1 items-center">
                <Input
                  value={addressStr}
                  onChange={(value) => {
                    setAddressStr(value);
                    setAddress(undefined);
                  }}
                  clearable
                  placeholder={intl.formatMessage({ defaultMessage: '請填寫地址', id: 'HnBEa1' })}
                />
              </div>
              <a onClick={() => setOpenAddress(true)} className="ml-2">
                {intl.formatMessage({ defaultMessage: '選擇地址', id: '1zPKfz' })}
              </a>
            </div>

            <div className="mt-4 rounded-xl bg-[#F6F7F9] p-4 text-xs leading-6 text-[#6175AE] dark:bg-[#3D424E] dark:text-[#AAAAAA]">
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

        <div className="mt-4 rounded-xl bg-white p-5 shadow-md shadow-black/5 dark:bg-[#2A2E38]">
          <div className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
            {intl.formatMessage({
              defaultMessage: '提幣數量',
              id: 'wbTfN9',
            })}
          </div>
          <Input
            type="number"
            min={Number(configs?.data?.fee ?? 0)}
            maxLength={18}
            className="mt-2.5 h-11 rounded border bg-[#F6F7F9] px-2.5 dark:border-none dark:bg-[#3D424E]"
            placeholder={intl.formatMessage({
              defaultMessage: '输入提币数量',
              id: 'rQ+HPv',
            })}
            value={amount}
            onChange={setAmount}
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-[#A2A9BC] dark:text-[#AAAAAA]">
              {intl.formatMessage({
                defaultMessage: '手續費',
                id: 'UXyFaa',
              })}
              ({symbol})
            </span>
            <span className="text-base text-[#6175AE] dark:text-white">
              {currency(configs?.data?.fee || 0, { precision, separator: '', symbol: '' }).format()}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-[#A2A9BC] dark:text-[#AAAAAA]">
              {intl.formatMessage({
                defaultMessage: '到賬數量',
                id: 'zldodU',
              })}
              ({symbol})
            </span>
            <span className="text-base text-[#6175AE] dark:text-white">{account}</span>
          </div>

          <div className="mt-4">
            <Button block color="primary" onClick={handleFinish} loading={withdrawSubmit.isLoading}>
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
              symbol,
              address: addressStr,
              chainType: chainType ?? '',
              addressId: address?.id ?? '0',
              payPass: md5(value).toUpperCase(),
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
          <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4 dark:bg-[#161720]">
            <div className="mb-4 text-sm text-[#3E4660] dark:text-white">
              {intl.formatMessage({
                defaultMessage: '我的提幣地址',
                id: '7rLwaw',
              })}
            </div>

            {addressList?.data?.map((v) => (
              <a
                key={v.id}
                className=" flex items-center rounded-lg bg-white px-5 py-4 shadow-md shadow-black/5 dark:bg-[#2A2E38]"
                onClick={() => {
                  setAddress(v);
                  setAddressStr(v.address);
                  setOpenAddress(false);
                }}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="text-lg text-[#6175AE] dark:text-white">{v.symbol ?? '-'}</div>
                  <div className="mt-1 break-words text-xs text-[#A2A9BC]">{v.address ?? '-'}</div>
                  <div className="mt-2 text-[#A2A9BC] dark:text-[#AAAAAA]">
                    {intl.formatMessage({
                      defaultMessage: '備注',
                      id: 'Be30m1',
                    })}
                    <span className="ml-1 text-[#3E4660] dark:text-white">{v.remark ?? '-'}</span>
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
      justify-content: center;
      align-items: center;
      border: 1px solid #00bab8;
      background-color: transparent;
      height: 32px;
      color: #00bab8;
      font-size: 16px;
      &.adm-selector-item-active {
        background-color: #00bab8;
        color: #fff;
      }
    }
  }
`;

export default TakeCoin;
