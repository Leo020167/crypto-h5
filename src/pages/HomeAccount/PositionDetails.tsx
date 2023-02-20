import { Button, Form, Input, Popup, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useProOrderDetail, useProOrderOpen } from '../../api/endpoints/transformer';

import ic_mark_green from '../../assets/ic_mark_green.png';
import ic_mark_red from '../../assets/ic_mark_red.png';
import Screen from '../../components/Screen';
import useSwitchColor from '../../hooks/useSwitchColor';
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

  const getColor = useSwitchColor();

  const lastPrice = useMemo(() => {
    if (data?.data?.data?.last) {
      if (data?.data?.data?.rate) {
        return [data?.data?.data?.last, data?.data?.data?.rate + '%'].join('    ');
      }
      return [data?.data?.data?.last, '0%'].join('    ');
    }
    return '0%';
  }, [data?.data?.data?.last, data?.data?.data?.rate]);

  const mark = useMemo(() => {
    if (Number(data?.data?.data?.rate) >= 0) {
      return <img src={ic_mark_red} alt="ic_mark_red" className="h-3 ml-1" />;
    }
    return <img src={ic_mark_green} alt="ic_mark_green" className="h-3 ml-1" />;
  }, [data?.data?.data?.rate]);

  return (
    <Screen
      headerTitle={symbol}
      footer={
        <div className="flex items-center p-4 gap-2">
          <a
            className=" h-10 flex-1 flex items-center justify-center text-base text-white bg-[#00ad88]"
            onClick={() => toBuySellPage(1)}
          >
            {intl.formatMessage({ defaultMessage: '買入', id: 'sY5/oP' })}
          </a>
          <a
            className=" h-10 flex-1 flex items-center justify-center text-base text-white bg-[#e2214e]"
            onClick={() => toBuySellPage(-1)}
          >
            {intl.formatMessage({ defaultMessage: '賣出', id: 'EOWvn9' })}
          </a>
        </div>
      }
    >
      <div
        className="py-8 border-b"
        onClick={() => {
          history.push({
            pathname: '/market2',
            search: stringify({
              symbol: data?.data?.data?.symbol,
              isLever: 1,
            }),
          });
        }}
      >
        <div className="text-center text-sm">
          {intl.formatMessage({ defaultMessage: '盈利USDT', id: 'KdeDu2' })}
        </div>
        <div
          className="text-center text-xl font-bold"
          style={{ color: getColor(data?.data?.data?.profit) }}
        >
          {data?.data?.data?.profit}
        </div>
        <div
          className="text-center text-sm font-bold"
          style={{ color: getColor(data?.data?.data?.profit) }}
        >
          {data?.data?.data?.profitRate ?? 0}%
        </div>
      </div>

      <div className="mt-4 px-4 text-[#3d3a50] ">
        <div className="flex justify-between">
          <span className="text-sm">
            {intl.formatMessage({ defaultMessage: '成本', id: '27fLgJ' })}
          </span>
          <span>{data?.data?.data?.price}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>{intl.formatMessage({ defaultMessage: '數量/可用', id: 'cofepD' })}</span>
          <span>
            {[data?.data?.data?.amount ?? 0, data?.data?.data?.availableAmount ?? 0].join('/')}
          </span>
        </div>
        <div className="flex justify-between mt-2">
          <span>
            {intl.formatMessage(
              { defaultMessage: '{symbol}現價', id: 'DRC113' },
              { symbol: data?.data?.data?.symbol },
            )}
          </span>
          <span className="flex items-center" style={{ color: getColor(data?.data?.data?.rate) }}>
            {lastPrice}
            {mark}
          </span>
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
