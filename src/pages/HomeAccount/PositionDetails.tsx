import { Button, Form, Input, Popup, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useProOrderDetail, useProOrderOpen } from '../../api/endpoints/transformer';
import { userAtom } from '../../atoms';
import Screen from '../../components/Screen';

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

  const user = useAtomValue(userAtom);
  const history = useHistory();

  const toBuySellPage = useCallback(
    (buySell: number) => {
      if (user) {
        history.push({
          pathname: '/trade-lever',
          search: stringify({
            symbol,
            buySell,
          }),
        });
      } else {
        history.push('/login');
      }
    },
    [history, symbol, user],
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

  return (
    <Screen
      headerTitle={symbol}
      footer={
        <div className="flex items-center p-4 gap-2">
          <a
            className=" h-10 flex-1 flex items-center justify-center text-base text-white bg-[#00ad88]"
            onClick={() => toBuySellPage(1)}
          >
            買入
          </a>
          <a
            className=" h-10 flex-1 flex items-center justify-center text-base text-white bg-[#e2214e]"
            onClick={() => toBuySellPage(-1)}
          >
            賣出
          </a>
        </div>
      }
    >
      <div className="py-8 border-b">
        <div className="text-center text-sm">總資產</div>
        <div className="text-center text-3xl text-[#3d3a50]">{data?.data?.data?.amount}</div>
      </div>

      <div className="mt-4 px-4 text-[#3d3a50] ">
        <div>
          <span className="text-sm">可用</span>
          <span></span>
        </div>
        <div className="mt-2">
          <span>委托</span>
          <span></span>
        </div>
      </div>

      <div className="p-4">
        <Button block color="primary" onClick={() => setOpen(true)}>
          設置止盈止損
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
                確定
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
              },
            });
          }}
        >
          <Form.Header>設定止盈止損</Form.Header>
          <Form.Item label="價格" name="price">
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="數量" name="hand">
            <Input type="number" placeholder="请输入" />
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
