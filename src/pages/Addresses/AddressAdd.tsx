import { Button, Dialog, Input, InputRef, Selector, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import md5 from 'js-md5';
import { stringify } from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { withDefault, StringParam, useQueryParam } from 'use-query-params';
import { useAddAddress, useGetCoinList } from '../../api/endpoints/transformer';
import PaymentPasswordDialog from '../../components/PaymentPasswordDialog';
import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
import CoinSymbolSelectDialog from '../RechargeCoin/CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');
const AddressAdd = () => {
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [chainType, setChainType] = useState<string>();
  const [openSymbol, setOpenSymbol] = useState(false);

  const [open, setOpen] = useState(false);

  const { data } = useGetCoinList(
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
      data?.data?.chainTypeList?.map((v) => ({
        value: v,
        label: v,
      })) ?? [],
    [data?.data?.chainTypeList],
  );

  const [copyText, setCopyText] = useState<string>();

  const handleFocus = useCallback(() => {
    navigator.clipboard
      .readText()
      .then((clipText) => {
        setCopyText(clipText);
      })
      .catch(() => {
        // ignore
      });
  }, []);

  useEffect(() => {
    document.addEventListener('copy', handleFocus);

    return () => {
      document.removeEventListener('copy', handleFocus);
    };
  }, [handleFocus]);

  useEffect(() => {
    window.addEventListener('visibilitychange', handleFocus, false);
    window.addEventListener('focus', handleFocus, false);
    return () => {
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [handleFocus]);

  const [address, setAddress] = useState<string>();
  const [remark, setRemark] = useState<string>();

  const inputRef = useRef<InputRef>(null);

  const intl = useIntl();
  const { userInfo } = useAuthStore();
  const history = useHistory();
  const addAddress = useAddAddress({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setOpen(false);
          Toast.show(data.msg);
          history.replace('/addresses');
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
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!address || !address.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入地址', id: '2fmtw4' }));
      return;
    }

    setOpen(true);
  }, [address, intl]);

  return (
    <Screen headerTitle="添加提幣地址">
      <Container className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="text-[#3E4660] text-sm mb-4">
          {intl.formatMessage({ defaultMessage: '添加提幣地址', id: 'GO/P/E' })}
        </div>

        <div className=" bg-white rounded-lg shadow-md shadow-black/5 p-4">
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
              <div className="text-right">
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
                      setChainType(value[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm text-[#3E4660]">
              {intl.formatMessage({ defaultMessage: '提幣地址', id: 'NUeill' })}
            </div>
            <div className="mt-4 relative flex items-center">
              <Input
                ref={inputRef}
                value={address}
                onChange={setAddress}
                placeholder={intl.formatMessage({ defaultMessage: '請輸入地址', id: '2fmtw4' })}
                className="flex items-center h-11 bg-[#EDF3FA] text-[#6175AE] px-2.5 rounded-md overflow-x-auto pr-12 w-full"
              />

              {copyText && (
                <a
                  className="absolute right-[-4px] h-8 bg-[#6175AE] text-white pl-2.5 pr-2 flex items-center text-sm rounded-tl-[14px] rounded-bl-[14px]  rounded-tr-md rounded-br-md"
                  onClick={() => {
                    setAddress(copyText);
                    inputRef.current?.focus();
                  }}
                >
                  {intl.formatMessage({ defaultMessage: '粘貼', id: 'Brhkdh' })}
                </a>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-[#3E4660]">
              {intl.formatMessage({ defaultMessage: '備注', id: 'Be30m1' })}
            </div>
            <div className="mt-4 relative flex items-center">
              <Input
                value={remark}
                onChange={setRemark}
                placeholder={intl.formatMessage({ defaultMessage: '請輸入備註', id: 'fLMjGv' })}
                className="flex items-center h-11 bg-[#EDF3FA] text-[#6175AE] px-2.5 rounded-md overflow-x-auto pr-12 w-full"
              />
            </div>
          </div>

          <Button
            block
            className="btn-purple mt-4"
            onClick={handleFinish}
            loading={addAddress.isLoading}
          >
            {intl.formatMessage({ defaultMessage: '添加', id: 'UH1kCc' })}
          </Button>
        </div>
      </Container>

      <CoinSymbolSelectDialog
        symbols={data?.data?.coinList}
        open={openSymbol}
        onClose={() => setOpenSymbol(false)}
        defaultValue={symbol}
        onSelect={(value) => {
          setOpenSymbol(false);
          setSymbol(value, 'replaceIn');
        }}
      />

      <PaymentPasswordDialog
        open={open}
        onClose={() => setOpen(false)}
        onFill={(value) => {
          addAddress.mutate({
            data: {
              address,
              chainType: symbol === 'USDT' ? chainType : '',
              remark: remark || '',
              symbol,
              payPass: md5(value),
            },
          });
        }}
      />
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

export default AddressAdd;
