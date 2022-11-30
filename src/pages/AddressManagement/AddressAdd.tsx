import { Button, Input, InputRef, Selector, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { withDefault, StringParam, useQueryParam } from 'use-query-params';
import { useAddAddress, useGetCoinList } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import CoinSymbolSelectDialog from '../RechargeCoin/CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');
const AddressAdd = () => {
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [chainType, setChainType] = useState<string>();
  const [openSymbol, setOpenSymbol] = useState(false);

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

  const history = useHistory();
  const addAddress = useAddAddress({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.replace('/address-management');
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!address || !address.trim().length) {
      Toast.show('請輸入地址');
      return;
    }

    addAddress.mutate({
      data: {
        address,
        chainType: symbol === 'USDT' ? chainType : '',
        remark,
        symbol,
      },
    });
  }, [addAddress, address, chainType, remark, symbol]);

  return (
    <Screen headerTitle="添加提幣地址">
      <Container className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="text-[#3E4660] text-sm mb-4">添加提幣地址</div>

        <div className=" bg-white rounded-lg shadow-md shadow-black/5 p-4">
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
                      setChainType(value[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm text-[#3E4660]">提幣地址</div>
            <div className="mt-4 relative flex items-center">
              <Input
                ref={inputRef}
                value={address}
                onChange={setAddress}
                placeholder="請輸入地址"
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
                  粘貼
                </a>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-[#3E4660]">備注</div>
            <div className="mt-4 relative flex items-center">
              <Input
                value={remark}
                onChange={setRemark}
                placeholder="請輸入備註"
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
            添加
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
