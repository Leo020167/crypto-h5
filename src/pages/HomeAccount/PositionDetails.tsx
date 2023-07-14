import { Button, Form, Input, Popup, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useProOrderDetail, useProOrderOpen } from '../../api/endpoints/transformer';

import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';

const PositionDetails = () => {
  const [open, setOpen] = useState(false);
  const [symbol] = useQueryParam('symbol', StringParam);

  const { data, refetch } = useProOrderDetail(
    {
      symbol: symbol ?? '',
    },
    {
      query: {
        enabled: !!symbol,
      },
    },
  );

  const { userInfo } = useAuthStore();
  const history = useHistory();

  const toBuySellPage = useCallback(
    (buySell: number) => {
      if (userInfo) {
        history.push({
          pathname: '/trade-lever2',
          search: stringify({
            symbol,
            buySell,
          }),
        });
      } else {
        history.push('/login');
      }
    },
    [history, symbol, userInfo],
  );

  const proOrderOpen = useProOrderOpen({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setOpen(false);
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  const intl = useIntl();

  return (
    <Screen
      headerTitle={symbol}
      footer={
        <div className="flex items-center gap-2 p-4">
          <a
            className=" flex h-10 flex-1 items-center justify-center bg-[#00ad88] text-base text-white"
            onClick={() => toBuySellPage(1)}
          >
            {intl.formatMessage({ defaultMessage: '買入', id: 'sY5/oP' })}
          </a>
          <a
            className=" flex h-10 flex-1 items-center justify-center bg-[#e2214e] text-base text-white"
            onClick={() => toBuySellPage(-1)}
          >
            {intl.formatMessage({ defaultMessage: '賣出', id: 'EOWvn9' })}
          </a>
        </div>
      }
    >
      <div className="border-b py-8">
        <div className="text-center text-sm">
          {intl.formatMessage({ defaultMessage: '總資產', id: 'IoCgCq' })}
        </div>
        <div className="text-center text-3xl text-[#3d3a50]">{data?.data?.data?.amount}</div>
      </div>

      <div className="mt-4 px-4 text-[#3d3a50] ">
        <div className="flex justify-between">
          <span className="text-sm">
            {intl.formatMessage({ defaultMessage: '可用', id: '7C3q18' })}
          </span>
          <span>{data?.data?.data?.availableAmount}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span>{intl.formatMessage({ defaultMessage: '委托', id: 'CKdped' })}</span>
          <span>{data?.data?.data?.frozenAmount}</span>
        </div>
      </div>

      <div className="p-4">
        <Button block color="primary" onClick={() => setOpen(true)}>
          {intl.formatMessage({ defaultMessage: '設置止盈止損', id: 'keuHvr' })}
        </Button>
      </div>

      <PopupWrapper
        visible={open}
        onMaskClick={() => {
          setOpen(false);
        }}
        bodyStyle={{ height: '40vh' }}
      >
        <Form
          layout="horizontal"
          mode="card"
          footer={
            <div className="px-4">
              <Button
                block
                type="submit"
                color="primary"
                size="large"
                loading={proOrderOpen.isLoading}
              >
                {intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' })}
              </Button>
            </div>
          }
          onFinish={(values) => {
            proOrderOpen.mutate({
              data: {
                usdtAmount: values.hand,
                symbol: symbol ?? '',
                buySell: 'sell',
                orderType: 'limit',
                price: values.price?.trim() ?? '0.0',
                hand: values.hand?.trim() ?? '0.0',
                type: '2',
              },
            });
          }}
        >
          <Form.Header>
            {intl.formatMessage({ defaultMessage: '設定止盈止損', id: 'TT0rUo' })}
          </Form.Header>
          <Form.Item
            label={intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
            name="price"
          >
            <Input
              type="number"
              placeholder={intl.formatMessage({ defaultMessage: '请输入價格', id: 'UZappM' })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
            name="hand"
          >
            <Input
              type="number"
              placeholder={intl.formatMessage({ defaultMessage: '请输入數量', id: 'HCvPwM' })}
            />
          </Form.Item>
        </Form>
      </PopupWrapper>
    </Screen>
  );
};

const PopupWrapper = styled(Popup)`
  .adm-form .adm-form-item-horizontal.adm-list-item {
    --prefix-width: 3rem;
  }
`;

export default PositionDetails;
