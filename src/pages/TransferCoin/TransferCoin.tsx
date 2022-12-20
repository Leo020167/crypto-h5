import { Button, Input, InputRef, List, Popup, Toast } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  useAccountListAccountType,
  useAccountTransfer,
  useGetSymbolMaxAmount,
  useGetTransferSymbols,
} from '../../api/endpoints/transformer';
import { ListAccountTypeResponseAllOfDataAccountTypeListItem } from '../../api/model';
import { ReactComponent as SvgChange } from '../../assets/change.svg';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import ic_transfer_point from '../../assets/ic_transfer_point.png';

import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';

/**
 * 划转
 * @returns
 */
const TransferCoin = () => {
  const [action, setAction] = useState<'from' | 'to' | 'symbols'>();

  const [accountTypeFrom, setAccountTypeFrom] =
    useState<ListAccountTypeResponseAllOfDataAccountTypeListItem>();

  const [accountTypeTo, setAccountTypeTo] =
    useState<ListAccountTypeResponseAllOfDataAccountTypeListItem>();

  const { userInfo } = useAuthStore();

  const { data } = useAccountListAccountType({
    query: {
      onSuccess(data) {
        if (data.code === '200' && data.data?.accountTypeList?.length) {
          setAccountTypeFrom(data.data?.accountTypeList[0]);

          setAccountTypeTo(data.data?.accountTypeList[1]);
        }
      },
    },
  });

  const [amount, setAmount] = useState<string>();
  const inputRef = useRef<InputRef>(null);

  const [symbol, setSymbol] = useState<string>();
  const { data: transferSymbols } = useGetTransferSymbols(
    {
      fromAccountType: accountTypeFrom?.accountType,
      toAccountType: accountTypeTo?.accountType,
    },
    {
      query: {
        enabled: !!(accountTypeFrom && accountTypeTo),
        onSuccess(data) {
          if (data.code === '200') {
            setSymbol(data.data?.[0]);
          }
        },
      },
    },
  );

  const { data: symbolMaxAmount, refetch } = useGetSymbolMaxAmount(
    {
      fromAccountType: accountTypeFrom?.accountType,
      symbol,
    },
    {
      query: {
        enabled: !!(accountTypeFrom && symbol),
      },
    },
  );

  const accountTransfer = useAccountTransfer({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          refetch();
          setAmount('');
        }
      },
    },
  });

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!amount || !amount.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入划轉數量', id: 'lksvRW' }));
      return;
    }

    if (accountTypeFrom && accountTypeTo) {
      if (accountTypeFrom.accountType === accountTypeTo.accountType) {
        Toast.show(intl.formatMessage({ defaultMessage: '相同賬戶之間不能划轉', id: 'Snhxet' }));
        return;
      }

      accountTransfer.mutate({
        data: {
          amount: amount ?? '',
          fromAccountType: accountTypeFrom?.accountType ?? '',
          toAccountType: accountTypeTo?.accountType ?? '',
          userId: userInfo?.userId ?? '',
        },
      });
    }
  }, [accountTransfer, accountTypeFrom, accountTypeTo, amount, intl, userInfo?.userId]);

  const handleChange = useCallback(() => {
    const placeholder = accountTypeTo;
    setAccountTypeTo(accountTypeFrom);
    setAccountTypeFrom(placeholder);
  }, [accountTypeFrom, accountTypeTo]);

  return (
    <Container
      headerTitle={intl.formatMessage({ defaultMessage: '划转', id: 'fGSeaa' })}
      navBarProps={{
        right: <Link to="/transfer-coin-history">记录</Link>,
      }}
      footer={
        <div className="px-4 mb-4">
          <Button block color="primary" onClick={handleFinish}>
            {intl.formatMessage({ defaultMessage: '划转', id: 'fGSeaa' })}
          </Button>
        </div>
      }
    >
      <div className="flex items-center p-5">
        <div className="h-28 border flex items-center justify-center mr-4 flex-1">
          <div className="ml-4">
            <img alt="" src={ic_transfer_point} className="h-14" />
          </div>

          <div className="flex-1 ml-4 h-full flex flex-col">
            <div className="border-b flex items-center flex-1">
              <span className="text-[#663D3A50]">
                {intl.formatMessage({ defaultMessage: '从', id: 'mDJb9E' })}
              </span>
              <a
                className="flex-1 flex items-center justify-between px-4"
                onClick={() => setAction('from')}
              >
                <span>{accountTypeFrom?.accountName}</span>
                <Arrow />
              </a>
            </div>
            <div className=" flex items-center flex-1">
              <span className="text-[#663D3A50]">
                {intl.formatMessage({ defaultMessage: '到', id: 'ChK/7j' })}
              </span>
              <a
                className="flex-1 flex  items-center justify-between px-4"
                onClick={() => setAction('to')}
              >
                <span>{accountTypeTo?.accountName}</span>
                <Arrow />
              </a>
            </div>
          </div>
        </div>
        <a onClick={handleChange}>
          <SvgChange />
        </a>
      </div>

      <div className="px-4">
        <a
          className="mt-4 flex items-center bg-[#EDF3FA] px-2.5"
          onClick={() => setAction('symbols')}
        >
          <div className="h-11 flex-1 flex items-center">{symbol}</div>
          <RightOutline fontSize={16} />
        </a>
      </div>

      <div className="mt-4 px-4">
        <div className="text-[#1D3155]">
          {intl.formatMessage({ defaultMessage: '划转数量', id: 'LRqmws' })}
        </div>
        <div className="relative flex items-center">
          <Input
            type="number"
            className="border-b py-2 font-bold pr-20"
            value={amount}
            onChange={setAmount}
            maxLength={18}
            placeholder={intl.formatMessage({ defaultMessage: '输入划转数量', id: 'TByK7F' })}
            ref={inputRef}
          />
          <div className="absolute right-12 text-[#666175AE]">{symbol}</div>
          <a
            className="absolute right-0 text-[#6175AE] text-xs"
            onClick={() => {
              setAmount(symbolMaxAmount?.data);
              inputRef.current?.focus();
            }}
          >
            {intl.formatMessage({ defaultMessage: '全部', id: 'dGBGbt' })}
          </a>
        </div>
        <div className="text-[#666175AE] mt-1 text-xs">
          {intl.formatMessage({ defaultMessage: '可用数量：', id: 'sVgCxu' })}
          {symbolMaxAmount?.data ?? '--' + symbol}
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-[#F2F2F2] p-2 text-[#663D3A50]">
          {intl.formatMessage({
            defaultMessage: '只有將資產划轉到相對應的賬戶才可以進行交易。賬戶間的划轉不收取手續費',
            id: 'K9kVz9',
          })}
        </div>
      </div>

      <Popup visible={action === 'symbols'} position="right">
        <Screen
          headerTitle={intl.formatMessage({
            defaultMessage: '选择币种',
            id: 'BP8aBu',
          })}
          navBarProps={{
            onBack() {
              setAction(undefined);
            },
          }}
        >
          <List>
            {transferSymbols?.data?.map((v) => (
              <List.Item
                key={v}
                arrow={null}
                onClick={() => {
                  setSymbol(v);
                  setAction(undefined);
                }}
              >
                {v}
              </List.Item>
            ))}
          </List>
        </Screen>
      </Popup>

      <Popup visible={action === 'from' || action === 'to'} position="right">
        <Screen
          headerTitle={intl.formatMessage({
            defaultMessage: '选择账户',
            id: 'un5/HP',
          })}
          navBarProps={{
            onBack() {
              setAction(undefined);
            },
          }}
        >
          <List>
            {data?.data?.accountTypeList?.map((v, index) => (
              <List.Item
                key={v.accountType ?? '' + index}
                arrow={null}
                onClick={() => {
                  if (action === 'from') {
                    setAccountTypeFrom(v);
                  } else {
                    setAccountTypeTo(v);
                  }
                  setAction(undefined);
                }}
              >
                {v.accountName}
              </List.Item>
            ))}
          </List>
        </Screen>
      </Popup>
    </Container>
  );
};

const Container = styled(Screen)`
  .adm-list-item-title {
    .adm-form-item-label {
      color: #1d3155;
      font-size: 14px;
    }
  }
`;

export default TransferCoin;
