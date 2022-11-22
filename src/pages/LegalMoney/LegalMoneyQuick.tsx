import { Button, Dialog, Input, InputRef, Toast } from 'antd-mobile';
import { useAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { first } from 'lodash-es';
import { stringify } from 'query-string';
import { useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import {
  useAccountOutHoldAmount,
  useIdentityGet,
  useOtcFindAdList,
} from '../../api/endpoints/transformer';
import { OtcFindAdListItem, Receipt } from '../../api/model';
import { ReactComponent as LegalHistory } from '../../assets/ic_svg_legal_history.svg';
import { ReactComponent as Transfer } from '../../assets/ic_svg_transfer.svg';
import ConfirmSellDialog from './ConfirmSellDialog';
import LegalMore from './LegalMore';
import LegalQuickBuyDialog from './LegalQuickBuyDialog';
import LegalQuickSellDialog from './LegalQuickSellDialog';
import OTCCurrencies from './OTCCurrencies';

const selectedClassNames = 'text-2xl font-bold text-white';
const unselectedClassNames = 'text-sm font-bold';

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

  const handleFinish = useCallback(() => {
    if (!otcFindAdListItem) return;

    if (!amount || !amount.trim().length || !Number(amount)) {
      Toast.show(type === 'buy' ? '請輸入購買數量' : '請輸入賣出數量');
      return;
    }

    if (identityGet?.data?.identityAuth?.state === '1') {
      setAction(type);
    } else {
      Dialog.confirm({
        title: '提示',
        content: '帳戶未實名',
        confirmText: '去認證',
        onConfirm() {
          history.push('/verified');
        },
      });
    }
  }, [amount, history, identityGet?.data?.identityAuth?.state, otcFindAdListItem, setAction, type]);

  const [receipt, setReceipt] = useState<Receipt>();

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 bg-[#6175AE] flex items-center px-5 text-[#CBCBCB] justify-between">
        <div>
          <a
            className={type === 'buy' ? selectedClassNames : unselectedClassNames}
            onClick={() => setType('buy', 'replaceIn')}
          >
            我要买
          </a>
          <a
            className={`ml-5 ${type === 'sell' ? selectedClassNames : unselectedClassNames}`}
            onClick={() => setType('sell', 'replaceIn')}
          >
            我要卖
          </a>
        </div>

        <div className="flex items-center">
          <Link to="/otc-order-history" className="w-10">
            <LegalHistory />
          </Link>

          <LegalMore />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center">
          <span className="text-base font-bold text-[#3D3A50] flex-1">
            {type === 'sell' ? '出售数量' : '购买数量'}
          </span>

          {type === 'sell' && (
            <Link to="/transfer-coin" className="px-2 py-1 flex items-center bg-[#f1f3ff] rounded">
              <Transfer className="w-4 h-4 mr-1" />
              <span className="text-xs text-[#3D3A50]">劃轉</span>
            </Link>
          )}

          <OTCCurrencies value={symbol} onChange={(value) => setSymbol(value, 'replaceIn')} />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center relative h-12">
          <Input
            type="number"
            placeholder="输入数量"
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
            价格约
            <span className="text-sm text-[#6175AE]">{otcFindAdListItem?.price ?? '0.00'}</span>
            <span>{unit}</span>
          </div>

          {type === 'sell' && !!accountOutHoldAmount?.data && (
            <span className="mx-4">余额{`${holdAmount} USDT`}</span>
          )}
        </div>

        <div className="mt-4 text-[#9A9A9A] text-xs">
          限额{`${otcFindAdListItem?.minCny}USDT-${otcFindAdListItem?.maxCny}USDT`}
        </div>
      </div>

      <div className="px-4 mt-12">
        <Button block color="primary" onClick={handleFinish}>
          0手续费购买
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
