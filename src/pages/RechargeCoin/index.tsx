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
      <Container className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="rounded-xl bg-white p-5 shadow-md shadow-black/5">
          <div className="flex items-center justify-between text-sm text-[#A2A9BC]">
            <span>
              {intl.formatMessage(
                { defaultMessage: '可用餘額({symbol})', id: 'p4Oi3U' },
                {
                  symbol,
                },
              )}
            </span>
            <span className="text-lg text-[#3E4660]">
              {chargeConfigs?.data?.availableAmount ?? '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#A2A9BC]">
            <span>
              {intl.formatMessage(
                { defaultMessage: '最小充值金額({symbol})', id: 'k5HUdW' },
                {
                  symbol,
                },
              )}
            </span>
            <span className="text-lg text-[#00BAB8]">
              {chargeConfigs?.data?.minChargeAmount ?? '0.00'}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white p-5 shadow-md shadow-black/5">
          <div className="flex items-start justify-between gap-x-2">
            <div>
              <span className="text-[#3E4660]">
                {intl.formatMessage({ defaultMessage: '選擇幣種', id: 'jJ0rDY' })}
              </span>
              <div className="mt-4">
                <a
                  className="flex h-8 items-center justify-center rounded border border-[#3E4660] px-2"
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
              <div className="flex-1 text-right">
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
          <div className="mt-5 border-t border-dashed border-[#E2E4F0]"></div>

          <div className="mt-8 flex items-center justify-center">
            {!!currentAddress?.address && (
              <QRCodeCanvas value={currentAddress?.address} width={180} height={180} />
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <span className="rounded-2xl bg-[#6175AE] px-3 py-2 text-xs text-white">
              {intl.formatMessage({ defaultMessage: '只允許充值', id: 'Zhkpb8' })}
              {symbol}
            </span>
          </div>

          <div className="mt-12 flex justify-between text-sm text-[#3E4660]">
            <span>{intl.formatMessage({ defaultMessage: '充幣地址', id: 'Q4foHv' })}</span>
            {symbol === 'USDT' && (
              <span>
                {intl.formatMessage({ defaultMessage: '當前鏈路：', id: '6T3Qx4' })}
                <span className="text-[#00BAB8]">{chainType}</span>
              </span>
            )}
          </div>

          <div className="relative mt-4 flex items-center">
            <div className="flex h-11 w-full items-center overflow-x-auto rounded-md bg-[#EDF3FA] px-2.5 pr-12 text-[#6175AE]">
              {currentAddress?.address}
            </div>
            {currentAddress?.address && (
              <a
                className="absolute right-[-4px] flex h-8 items-center rounded-bl-[14px] rounded-br-md rounded-tl-[14px] rounded-tr-md bg-[#6175AE] pl-2.5 pr-2  text-sm text-white"
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

export default RechargeCoin;
