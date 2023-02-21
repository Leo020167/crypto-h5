import { Button, Dialog, Input, InputRef, Toast } from 'antd-mobile';
import { useAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { first } from 'lodash-es';
import { stringify } from 'query-string';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import {
  useAccountOutHoldAmount,
  useIdentityGet,
  useOtcFindAdList,
} from '../../api/endpoints/transformer';
import { OtcFindAdListItem, Receipt } from '../../api/model';
import ConfirmSellDialog from './ConfirmSellDialog';
import LegalMoneyHeader from './LegalMoneyHeader';
import LegalQuickBuyDialog from './LegalQuickBuyDialog';
import LegalQuickSellDialog from './LegalQuickSellDialog';
import OTCCurrencies from './OTCCurrencies';
import Transfer from './Transfer';

const TypeParam = withDefault(StringParam, 'buy');
const SymbolParam = withDefault(StringParam, 'CNY');

const amountAtom = atomWithReset<string>('');

const LegalMoneyQuick = () => {
  const [type, setType] = useQueryParam('type', TypeParam);
  const [symbol, setSymbol] = useQueryParam('symbol', SymbolParam);
  const [action, setAction] = useQueryParam('action', StringParam);

  const [amount, setAmount] = useAtom(amountAtom);

  const unit = symbol + '/USDT';

  const { data: otcFindAdList } = useOtcFindAdList({
    buySell: type,
    currencyType: symbol,
    filterCny: '',
    filterPayWay: '0',
    pageNo: '1',
    type: 'fast',
  });

  const { data: accountOutHoldAmount } = useAccountOutHoldAmount(
    {
      accountType: 'balance',
    },
    {
      query: {
        enabled: type === 'sell',
      },
    },
  );

  const otcFindAdListItem: OtcFindAdListItem | undefined = first(otcFindAdList?.data?.data);

  const holdAmount = accountOutHoldAmount?.data?.holdAmount ?? '';

  const inputRef = useRef<InputRef>(null);

  const { data: identityGet } = useIdentityGet();

  const history = useHistory();

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!otcFindAdListItem) return;

    if (!amount || !amount.trim().length || !Number(amount)) {
      Toast.show(
        type === 'buy'
          ? intl.formatMessage({ defaultMessage: '請輸入充值數量', id: 'kkfQaB' })
          : intl.formatMessage({ defaultMessage: '請輸入賣出數量', id: '9DlDCO' }),
      );
      return;
    }

    if (identityGet?.data?.identityAuth?.state === '1') {
      setAction(type);
    } else {
      Dialog.confirm({
        title: intl.formatMessage({ defaultMessage: '提示', id: 'kCh5Jz' }),
        content: intl.formatMessage({ defaultMessage: '帳戶未實名', id: 'ans63b' }),
        confirmText: intl.formatMessage({ defaultMessage: '去認證', id: 'jefLBO' }),
        onConfirm() {
          history.push('/verified');
        },
      });
    }
  }, [
    amount,
    history,
    identityGet?.data?.identityAuth?.state,
    intl,
    otcFindAdListItem,
    setAction,
    type,
  ]);

  const [receipt, setReceipt] = useState<Receipt>();

  return (
    <div className="flex-1 flex flex-col">
      <LegalMoneyHeader value={type} onChange={(value) => setType(value, 'replaceIn')} />

      <div className="px-4 mt-4">
        <div className="flex items-center">
          <span className="text-base font-bold text-[#3D3A50] flex-1">
            {type === 'sell'
              ? intl.formatMessage({ defaultMessage: '提現數量', id: 'ZoBIyE' })
              : intl.formatMessage({ defaultMessage: '購買數量', id: '3s7D9W' })}
          </span>

          {type === 'sell' && <Transfer />}

          <OTCCurrencies value={symbol} onChange={(value) => setSymbol(value, 'replaceIn')} />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center relative h-12">
          <Input
            type="number"
            placeholder={intl.formatMessage({ defaultMessage: '輸入數量', id: 'KCC04w' })}
            className="text-xl font-bold border-b h-full"
            value={amount}
            onChange={setAmount}
            ref={inputRef}
          />
          <div className="absolute right-0 text-xs flex">
            <span className="mr-4 text-[#9A9A9A]">USDT</span>
            {type === 'sell' && (
              <a
                className="px-4 text-[#6175AE] border-l border-[#9A9A9A]"
                onClick={() => {
                  setAmount(holdAmount);
                  inputRef.current?.focus();
                }}
              >
                全部
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="text-[#9A9A9A] text-xs flex items-center justify-between">
          <div>
            {intl.formatMessage({ defaultMessage: '價格約', id: 'FqoFLn' })}
            <span className="text-sm text-[#6175AE]">{otcFindAdListItem?.price ?? '0.00'}</span>
            <span>{unit}</span>
          </div>

          {type === 'sell' && !!accountOutHoldAmount?.data && (
            <span className="mx-4">
              {intl.formatMessage({ defaultMessage: '餘額', id: 'hPHyre' })}
              {`${holdAmount} USDT`}
            </span>
          )}
        </div>

        <div className="mt-4 text-[#9A9A9A] text-xs">
          {intl.formatMessage({ defaultMessage: '限額', id: 'zGwnHi' })}
          {`${otcFindAdListItem?.minCny ?? '0.00'}USDT-${otcFindAdListItem?.maxCny ?? '0.00'}USDT`}
        </div>
      </div>

      <div className="px-4 mt-12">
        <Button block color="primary" onClick={handleFinish}>
          {type === 'sell'
            ? intl.formatMessage({ defaultMessage: '0手續費提現', id: 'dNYJcI' })
            : intl.formatMessage({ defaultMessage: '0手續費充值', id: 'Eqmzsx' })}
        </Button>
      </div>

      <LegalQuickBuyDialog
        optionalOrder={otcFindAdListItem}
        symbol={symbol}
        amount={amount}
        open={action === 'buy'}
        onClose={() => setAction(undefined, 'replaceIn')}
        onSuccess={(orderId) => {
          setAmount('');
          setAction(undefined, 'replaceIn');

          history.push({
            pathname: '/legal-order-info',
            search: stringify({ orderId }),
          });
        }}
      />

      <LegalQuickSellDialog
        open={action === 'sell'}
        onClose={() => setAction(undefined, 'replaceIn')}
        onSelect={(receipt) => {
          setReceipt(receipt);
          setAction('confirm-sell', 'replaceIn');
        }}
      />

      <ConfirmSellDialog
        open={action === 'confirm-sell'}
        onClose={() => setAction(undefined, 'replaceIn')}
        receipt={receipt}
        optionalOrder={otcFindAdListItem}
        symbol={symbol}
        amount={amount}
      />
    </div>
  );
};

export default LegalMoneyQuick;
