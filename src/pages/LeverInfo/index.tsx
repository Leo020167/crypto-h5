import { Button, Dialog, Form, Input, List, Popup, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import {
  useProOrderClose,
  useProOrderDetail,
  useProOrderUpdateLossPrice,
  useProOrderUpdateWinPrice,
} from '../../api/endpoints/transformer';
import ic_mark_green from '../../assets/ic_mark_green.png';
import ic_mark_red from '../../assets/ic_mark_red.png';
import Screen from '../../components/Screen';
import useSwitchColor from '../../hooks/useSwitchColor';
import { stringDateFormat } from '../../utils/date';

const LeverInfo = () => {
  const [orderId] = useQueryParam('orderId', StringParam);

  const [openStopWin, setOpenStopWin] = useState(false);
  const [stopWin, setStopWin] = useState<string>();

  const [openSetLoss, setOpenSetLoss] = useState(false);
  const [loss, setLoss] = useState<string>();

  const [openClosePosition, setOpenClosePosition] = useState(false);
  const [closeHand, setCloseHand] = useState<string>();

  const { data, refetch } = useProOrderDetail(
    { orderId: orderId ?? '' },
    {
      query: {
        enabled: !!orderId,
        onSuccess(data) {
          console.log(data.data?.order?.stopWinPrice);
          setStopWin(data.data?.order?.stopWinPrice);
        },
      },
    },
  );

  const order = data?.data?.order;

  const getColor = useSwitchColor();

  const color = useMemo(() => getColor(Number(order?.profit)), [getColor, order?.profit]);

  const nowPrice = useMemo(() => {
    if (order?.closeDone !== '1') {
      return (
        <Link
          to={{ pathname: '/market', search: stringify({ symbol: order?.symbol, isLever: 1 }) }}
          className="flex items-center"
          style={{ color: getColor(order?.rate) }}
        >
          <span>{order?.last}</span>
          <span className="ml-2">
            {Number(order?.rate) >= 0 ? '+' : ''}
            {order?.rate}%
          </span>
          <img
            alt=""
            src={Number(order?.rate) >= 0 ? ic_mark_red : ic_mark_green}
            className=" w-4 h-4 ml-1"
          />
        </Link>
      );
    }
    return null;
  }, [getColor, order?.closeDone, order?.last, order?.rate, order?.symbol]);

  const proOrderUpdateWinPrice = useProOrderUpdateWinPrice({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          setOpenStopWin(false);
          Toast.show(data.msg);
        }
      },
    },
  });

  const proOrderUpdateLossPrice = useProOrderUpdateLossPrice({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          setOpenSetLoss(false);
          Toast.show(data.msg);
        }
      },
    },
  });

  const proOrderClose = useProOrderClose({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          setOpenClosePosition(false);
          Toast.show(data.msg);
        }
      },
    },
  });

  return (
    <Screen
      headerTitle={order?.symbol}
      footer={
        <div className="flex gap-4 p-4">
          <Button block onClick={() => setOpenClosePosition(true)}>
            普通平倉
          </Button>
          <Button
            block
            color="primary"
            onClick={() => {
              Dialog.confirm({
                content: `是否以當前市價平倉${order?.openHand}？`,
                confirmText: '確定',
                onConfirm() {
                  proOrderClose.mutate({
                    data: {
                      orderId: orderId ?? '',
                      closeHand: '0',
                    },
                  });
                },
              });
            }}
          >
            快捷平倉
          </Button>
        </div>
      }
    >
      <Container className="flex-1 overflow-y-auto">
        <div className=" py-8 text-center text-[#3d3a50]">
          <div className="text-sm ">盈利(USDT)</div>
          <div className="text-3xl font-bold" style={{ color }}>
            {Number(order?.profit) >= 0 ? '+' : ''}
            {order?.profit}
          </div>
          <div style={{ color }}>
            {Number(order?.profitRate) >= 0 ? '+' : ''}
            {order?.profitRate}%
          </div>
        </div>

        <div className="px-4">
          <List>
            <List.Item title="開倉價" extra={order?.openPrice} />
            <List.Item
              title="開倉方向"
              extra={
                <span style={{ color: getColor(order?.buySell === 'buy' ? 1 : -1) }}>
                  {order?.buySellValue}
                </span>
              }
            />
            <List.Item title="持倉保證金" extra={order?.openBail} />
            <List.Item title="持倉手數" extra={order?.openHand} />
            <List.Item title="開倉手續費" extra={order?.openFee} />
            <List.Item title="開倉時間" extra={stringDateFormat(order?.openTime)} />
            <List.Item
              title={
                <div className="flex items-center">
                  止盈價格
                  <a
                    onClick={() => setOpenStopWin(true)}
                    className="w-11 ml-4 bg-[#E2214E] text-white rounded text-xs h-5 flex items-center justify-center"
                  >
                    設置
                  </a>
                </div>
              }
              extra={order?.stopWinPrice === '0' ? '無設置' : order?.stopWinPrice}
            />
            <List.Item
              title={
                <div className="flex items-center">
                  止損價格
                  <a
                    onClick={() => setOpenSetLoss(true)}
                    className="w-11 ml-4 bg-[#00AD88] text-white rounded text-xs h-5 flex items-center justify-center"
                  >
                    設置
                  </a>
                </div>
              }
              extra={order?.stopLossPrice === '0' ? '無設置' : order?.stopLossPrice}
            />
            <List.Item title="開倉狀態" extra={order?.nowStateDesc} />
            <List.Item title={order?.symbol + '現價'} extra={nowPrice} />
          </List>
        </div>

        <div className="py-5 px-4">
          <div className="text-lg font-bold text-[#3d3a50]">平倉明細</div>
        </div>
      </Container>

      <Popup visible={openStopWin} onClose={() => setOpenStopWin(false)} closeOnMaskClick>
        <Form
          className="px-4"
          style={{
            '--prefix-width': '4rem',
          }}
          layout="horizontal"
          mode="card"
          onFinish={() => {
            proOrderUpdateWinPrice.mutate({
              data: {
                orderId: orderId ?? '',
                stopWinPrice: stopWin ?? '0.0',
              },
            });
          }}
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
        >
          <Form.Header>止盈設置</Form.Header>
          <Form.Item label="止盈價">
            <Input
              type="number"
              maxLength={18}
              value={stopWin}
              onChange={setStopWin}
              placeholder="請輸入止盈價"
            />
          </Form.Item>
        </Form>
      </Popup>

      <Popup visible={openSetLoss} onClose={() => setOpenSetLoss(false)} closeOnMaskClick>
        <Form
          className="px-4"
          style={{
            '--prefix-width': '4rem',
          }}
          layout="horizontal"
          mode="card"
          onFinish={() => {
            proOrderUpdateLossPrice.mutate({
              data: {
                orderId: orderId ?? '',
                stopLossPrice: loss ?? '0.0',
              },
            });
          }}
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
        >
          <Form.Header>止損設置</Form.Header>
          <Form.Item label="止損價">
            <Input
              type="number"
              maxLength={18}
              value={loss}
              onChange={setLoss}
              placeholder="請輸入止損價"
            />
          </Form.Item>
        </Form>
      </Popup>

      <Popup
        visible={openClosePosition}
        onClose={() => setOpenClosePosition(false)}
        closeOnMaskClick
      >
        <Form
          className="px-4"
          style={{
            '--prefix-width': '4rem',
          }}
          layout="horizontal"
          mode="card"
          onFinish={() => {
            if (!closeHand || !closeHand.trim().length) return;
            proOrderClose.mutate({
              data: {
                orderId: orderId ?? '',
                closeHand: loss ?? '0.0',
              },
            });
          }}
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
        >
          <Form.Header>
            <span className="text-black">普通平倉</span>
            <span className="text-xs">(以當前市價成交)</span>
          </Form.Header>
          <div className="flex items-center mt-4">
            <Input
              type="number"
              max={Number(order?.openHand)}
              maxLength={18}
              value={closeHand}
              onChange={setCloseHand}
              placeholder="請輸入平倉手數"
              className="border-b h-10"
            />
            <span className="text-sm">手</span>
          </div>
          <div className="text-gray-400 text-xs mt-2">持倉手數{order?.openHand}</div>
        </Form>
      </Popup>
    </Screen>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 0;
  }

  .adm-list-item-content-main {
    padding: 4px 0;
  }

  .adm-list-item-title,
  .adm-list-item-description,
  .adm-list-item-content-extra {
    color: #3d3a50;
    font-size: 14px;
  }
  .adm-list-item-content {
    padding-right: 0;
    border: 0;
  }
`;

export default LeverInfo;
