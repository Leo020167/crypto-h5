import { Button, Input, InputRef, List, Popup, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  useAccountListAccountType,
  useAccountOutHoldAmount,
  useAccountTransfer,
} from '../../api/endpoints/transformer';
import { ListAccountTypeResponseAllOfDataAccountTypeListItem } from '../../api/model';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import ic_transfer_point from '../../assets/ic_transfer_point.png';
import { userAtom } from '../../atoms';
import Screen from '../../components/Screen';

/**
 * 划转
 * @returns
 */
const TransferCoin = () => {
  const [action, setAction] = useState<'from' | 'to'>();

  const [accountTypeFrom, setAccountTypeFrom] =
    useState<ListAccountTypeResponseAllOfDataAccountTypeListItem>();

  const [accountTypeTo, setAccountTypeTo] =
    useState<ListAccountTypeResponseAllOfDataAccountTypeListItem>();

  const user = useAtomValue(userAtom);

  const { data: outHoldAmount, refetch } = useAccountOutHoldAmount(
    {
      accountType: accountTypeFrom?.accountType ?? '',
    },
    {
      query: {
        enabled: !!(accountTypeFrom?.accountType && user?.userId),
      },
    },
  );

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

  const handleFinish = useCallback(() => {
    if (!amount || !amount.trim().length) {
      Toast.show('請輸入划轉數量');
      return;
    }

    if (accountTypeFrom && accountTypeTo) {
      if (accountTypeFrom.accountType === accountTypeTo.accountType) {
        Toast.show('相同賬戶之間不能划轉');
        return;
      }

      accountTransfer.mutate({
        data: {
          amount: amount ?? '',
          fromAccountType: accountTypeFrom?.accountType ?? '',
          toAccountType: accountTypeTo?.accountType ?? '',
          userId: user?.userId ?? '',
        },
      });
    }
  }, [accountTransfer, accountTypeFrom, accountTypeTo, amount, user?.userId]);

  return (
    <Container
      headerTitle="划转"
      navBarProps={{
        right: <Link to="/transfer-coin-history">记录</Link>,
      }}
      footer={
        <div className="px-4 mb-4">
          <Button block color="primary" onClick={handleFinish}>
            划转
          </Button>
        </div>
      }
    >
      <div className="h-28 m-5 border flex items-center justify-center">
        <div className="ml-4">
          <img alt="" src={ic_transfer_point} className="h-14" />
        </div>

        <div className="flex-1 ml-4 h-full flex flex-col">
          <div className="border-b flex items-center flex-1">
            <span className="text-[#663D3A50]">从</span>
            <a
              className="flex-1 flex items-center justify-between px-4"
              onClick={() => setAction('from')}
            >
              <span>{accountTypeFrom?.accountName}</span>
              <Arrow />
            </a>
          </div>
          <div className=" flex items-center flex-1">
            <span className="text-[#663D3A50]">到</span>
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

      <div className="mt-4 px-4">
        <div className="text-[#1D3155]">划转数量</div>
        <div className="relative flex items-center">
          <Input
            type="number"
            className="border-b py-2 font-bold pr-20"
            value={amount}
            onChange={setAmount}
            maxLength={18}
            placeholder="输入划转数量"
            ref={inputRef}
          />
          <div className="absolute right-12 text-[#666175AE]">USDT</div>
          <a
            className="absolute right-0 text-[#6175AE] text-xs"
            onClick={() => {
              setAmount(outHoldAmount?.data?.holdAmount);
              inputRef.current?.focus();
            }}
          >
            全部
          </a>
        </div>
        <div className="text-[#666175AE] mt-1 text-xs">
          可用数量：{outHoldAmount?.data?.holdAmount ?? '--' + 'USDT'}
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-[#F2F2F2] p-2 text-[#663D3A50]">
          只有將資產划轉到相對應的賬戶才可以進行交易。賬戶間的划轉不收取手續費
        </div>
      </div>

      <Popup visible={!!action} position="right">
        <Screen
          headerTitle="选择账户"
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
