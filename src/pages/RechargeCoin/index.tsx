import { Selector, Toast } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { find } from 'lodash-es';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useCopyToClipboard, useInterval } from 'react-use';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useGetChargeConfigs, useGetCoinList } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import CoinSymbolSelectDialog from './CoinSymbolSelectDialog';

const SymbolParam = withDefault(StringParam, 'USDT');

const RechargeCoin = () => {
  const [chainType, setChainType] = useQueryParam('chainType', StringParam);
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [openSymbol, setOpenSymbol] = useState(false);

  const { data: coinList } = useGetCoinList({
    inOut: 1,
  });

  const { data: chargeConfigs, refetch } = useGetChargeConfigs(
    { symbol },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  useInterval(() => {
    refetch();
  }, 2000);

  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    if (chargeConfigs?.data?.addressList?.length) {
      setChainType(chargeConfigs?.data?.addressList?.[0]?.chainType, 'replaceIn');
      mounted.current = true;
    }
  }, [chargeConfigs?.data?.addressList, setChainType]);

  const options = useMemo(
    () =>
      chargeConfigs?.data?.addressList?.map((v) => ({
        value: v.chainType ?? '',
        label: v.chainType ?? '',
      })) ?? [],
    [chargeConfigs?.data?.addressList],
  );

  const addressList = useMemo(
    () => chargeConfigs?.data?.addressList ?? [],
    [chargeConfigs?.data?.addressList],
  );

  const currentAddress = useMemo(() => {
    return find(addressList, (v) => {
      if (symbol === 'USDT') {
        return v.chainType === chainType;
      }
      return v.symbol === symbol;
    });
  }, [addressList, chainType, symbol]);

  const [, copyToClipboard] = useCopyToClipboard();

  const intl = useIntl();

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}
      navBarProps={{
        right: (
          <Link to="/take-coin-history">
            {intl.formatMessage({ defaultMessage: '记录', id: 'YvriPY' })}
          </Link>
        ),
      }}
    >
      <Container className="p-4 bg-[#F4F6F4] flex-1 overflow-y-auto">
        <div className="rounded-xl shadow-md shadow-black/5 p-5 bg-white">
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>
              {intl.formatMessage(
                { defaultMessage: '可用餘額({symbol})', id: 'rv8bFi' },
                {
                  symbol,
                },
              )}
            </span>
            <span className="text-[#3E4660] text-lg">
              {chargeConfigs?.data?.availableAmount ?? '0.00'}
            </span>
          </div>
          <div className="text-[#A2A9BC] flex items-center justify-between text-sm">
            <span>
              {intl.formatMessage(
                { defaultMessage: '最小充值金額({symbol})', id: 'EmziDl' },
                {
                  symbol,
                },
              )}
            </span>
            <span className="text-[#00BAB8] text-lg">
              {chargeConfigs?.data?.minChargeAmount ?? '0.00'}
            </span>
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
                      setChainType(value[0], 'replaceIn');
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="border-t border-dashed border-[#E2E4F0] mt-5"></div>

          <div className="flex items-center justify-center mt-8">
            {!!currentAddress?.address && (
              <QRCodeCanvas value={currentAddress?.address} width={180} height={180} />
            )}
          </div>

          <div className="flex justify-center mt-8">
            <span className="bg-[#6175AE] text-white rounded-2xl px-3 py-2 text-xs">
              {intl.formatMessage({ defaultMessage: '只允許充值', id: 'Zhkpb8' })}
              {symbol}
            </span>
          </div>

          <div className="mt-12 text-sm text-[#3E4660] flex justify-between">
            <span>{intl.formatMessage({ defaultMessage: '充幣地址', id: 'Q4foHv' })}</span>
            {symbol === 'USDT' && (
              <span>
                {intl.formatMessage({ defaultMessage: '當前鏈路：', id: '6T3Qx4' })}
                <span className="text-[#00BAB8]">{chainType}</span>
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
                    Toast.show(
                      intl.formatMessage({ defaultMessage: '已複製到粘貼板', id: 'GBuUew' }),
                    );
                  }
                }}
              >
                {intl.formatMessage({ defaultMessage: '複製', id: 'Dw4KtW' })}
              </a>
            )}
          </div>
        </div>

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
