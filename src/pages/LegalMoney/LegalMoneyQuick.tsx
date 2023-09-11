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

  const { data: identityGet } = useIdentityGet({ type: '2' });

  const history = useHistory();

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!otcFindAdListItem) return;

    if (!amount || !amount.trim().length || !Number(amount)) {
      Toast.show(
        type === 'buy'
          ? intl.formatMessage({ defaultMessage: '請輸入購買數量', id: 'ap+l4f' })
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
        cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
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
    <div className="flex flex-1 flex-col">
      <LegalMoneyHeader value={type} onChange={(value) => setType(value, 'replaceIn')} />

      <div className="mt-4 px-4">
        <div className="flex items-center">
          <span className="flex-1 text-base font-bold text-[#3D3A50]">
            {type === 'sell'
              ? intl.formatMessage({ defaultMessage: '出售數量', id: 'S/yKCZ' })
              : intl.formatMessage({ defaultMessage: '購買數量', id: '3s7D9W' })}
          </span>

          {type === 'sell' && <Transfer />}

          <OTCCurrencies value={symbol} onChange={(value) => setSymbol(value, 'replaceIn')} />
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="relative flex h-12 items-center">
          <Input
            type="number"
            placeholder={intl.formatMessage({ defaultMessage: '輸入數量', id: 'KCC04w' })}
            className="h-full border-b text-xl font-bold"
            value={amount}
            onChange={setAmount}
            ref={inputRef}
          />
          <div className="absolute right-0 flex text-xs">
            <span className="mr-4 text-[#9A9A9A]">USDT</span>
            {type === 'sell' && (
              <a
                className="border-l border-[#9A9A9A] px-4 text-[#6175AE]"
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

      <div className="mt-4 px-4">
        <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
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

        <div className="mt-4 text-xs text-[#9A9A9A]">
          {intl.formatMessage({ defaultMessage: '限額', id: 'zGwnHi' })}
          {`${otcFindAdListItem?.minCny}USDT-${otcFindAdListItem?.maxCny}USDT`}
        </div>
      </div>

      <div className="mt-12 px-4">
        <Button block color="primary" onClick={handleFinish}>
          {intl.formatMessage({ defaultMessage: '0手續費購買', id: 'NxOp7s' })}
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
