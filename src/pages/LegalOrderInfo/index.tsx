import { Button, List, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useOtcCancelOrder, useOtcGetOrderDetail } from '../../api/endpoints/transformer';
import { Order, Receipt } from '../../api/model';
import { ReactComponent as SvgCopy } from '../../assets/ic_svg_copy.svg';
import { ReactComponent as SvgOtcFalse } from '../../assets/ic_svg_otc_false.svg';
import { ReactComponent as SvgOtcSuccess } from '../../assets/ic_svg_otc_success.svg';
import { ReactComponent as SvgTime } from '../../assets/ic_svg_time.svg';
import { userAtom } from '../../atoms';
import Countdown from '../../components/Countdown';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';
import { getReceipts, OtcOrderState } from '../../utils/response';
import Clock from './Clock';
import OrderCancelDialog from './OrderCancelDialog';

const HeaderRight = ({
  order,
  isBuyer,
  onFinish,
}: {
  order?: Order;
  isBuyer: boolean;
  onFinish: () => void;
}) => {
  if (!order) return null;

  if (OtcOrderState.wait === order.state) {
    if (isBuyer) {
      return <SvgTime className="w-10 h-10" />;
    } else {
      return <Clock orderPaySecondTime={order.paySecondTime} onFinish={onFinish} />;
    }
  }

  if (OtcOrderState.mark === order.state) {
    if (isBuyer) {
      return <Clock orderPaySecondTime={order.paySecondTime} onFinish={onFinish} />;
    } else {
      return <SvgTime className="w-10 h-10" />;
    }
  }

  if (OtcOrderState.done === order.state) {
    return <SvgOtcSuccess className="w-10 h-10" />;
  }

  if (OtcOrderState.appeal === order.state) {
    return <SvgTime className="w-10 h-10" />;
  }

  if (
    OtcOrderState.expire === order.state ||
    OtcOrderState.cancel === order.state ||
    OtcOrderState.admin_cancel === order.state
  ) {
    return <SvgOtcFalse className="w-10 h-10" />;
  }

  return null;
};

const LegalOrderInfo = () => {
  const [orderId] = useQueryParam('orderId', StringParam);
  const [action, setAction] = useQueryParam('action', StringParam);

  const { data, refetch } = useOtcGetOrderDetail(
    {
      orderId: orderId ?? '',
    },
    {
      query: {
        enabled: !!orderId,
      },
    },
  );

  const order = useMemo(() => data?.data?.order, [data?.data?.order]);

  const tips = useMemo(() => {
    return order?.stateTip;
  }, [order?.stateTip]);

  const receipts = useMemo(() => getReceipts(order?.showPayWay), [order?.showPayWay]);

  const receipt: Receipt | undefined = useMemo(() => receipts?.[0], [receipts]);

  const user = useAtomValue(userAtom);
  const isBuyer = useMemo(
    () => !!user?.userId && !!order?.buyUserId && user?.userId === order?.buyUserId,
    [order?.buyUserId, user?.userId],
  );

  const names = useMemo(() => {
    return isBuyer
      ? {
          nickName: '賣家暱稱',
          name: '賣家姓名',
        }
      : {
          nickName: '買家暱稱',
          name: '參數錯誤',
        };
  }, [isBuyer]);

  const history = useHistory();

  const footer = useMemo(() => {
    if (order?.state === OtcOrderState.wait) {
      if (isBuyer) {
        return (
          <div className="flex p-4">
            <Button block onClick={() => setAction('cancel', 'replaceIn')}>
              取消訂單
            </Button>
            <Button
              block
              color="primary"
              className="ml-4"
              onClick={() => {
                history.push({
                  pathname: '/legal-pay',
                  search: stringify({
                    orderId,
                    showUserId: order.showUserId,
                    paymentId: receipt.paymentId,
                  }),
                });
              }}
            >
              去付款
            </Button>
          </div>
        );
      } else {
        return (
          <div className="flex p-4">
            <Button key="receivedConfirm" block color="primary" disabled>
              我確認收到付款
            </Button>
          </div>
        );
      }
    } else if (order?.state === OtcOrderState.mark) {
      // TODO showOtcConfirmReceivedPayDialog
      // TODO 賣家申訴
      if (isBuyer) {
        return (
          <div className="flex p-4">
            <Button
              block
              onClick={() =>
                history.push({
                  pathname: '/otc-appeal',
                  search: stringify({ orderId }),
                })
              }
            >
              申訴
            </Button>
          </div>
        );
      } else {
        <div className="flex p-4">
          <Button block color="primary" className="ml-4">
            我確認收到付款
          </Button>
        </div>;
      }
    }

    return null;
  }, [history, isBuyer, order?.showUserId, order?.state, orderId, receipt.paymentId, setAction]);

  const handleTimeout = useCallback(() => {
    Toast.show('訂單已經超時');
    refetch();
  }, [refetch]);

  const header = useMemo(() => {
    return (
      <div className="p-4 flex items-center justify-between border-b border-[#EEEEEE]">
        <div>
          <span className=" text-2xl font-bold text-[#3D3A50]">{order?.stateValue}</span>
          <div className="text-xs mt-2">
            {tips}
            {order?.state === OtcOrderState.wait && isBuyer && (
              <span className="text-[#6175AE]">
                <Countdown orderPaySecondTime={order.paySecondTime} onFinish={handleTimeout} />
              </span>
            )}
          </div>
        </div>

        <HeaderRight order={order} isBuyer={isBuyer} onFinish={handleTimeout} />
      </div>
    );
  }, [handleTimeout, isBuyer, order, tips]);

  const otcCancelOrder = useOtcCancelOrder({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setAction(undefined, 'replaceIn');
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  return (
    <Screen footer={footer}>
      <Container className="flex-1 overflow-y-auto">
        {header}
        <div className="my-4">
          <span className="text-base font-bold text-[#3D3A50] p-4">
            {order?.buySellValue ?? '--'}
          </span>
          <List className="mt-4">
            <List.Item
              title="總價"
              extra={
                <span className="text-[#6175AE] font-bold text-xl">
                  {order?.currencySign}
                  {order?.tolPrice}
                </span>
              }
            />
            <List.Item
              title="價格"
              extra={
                <span>
                  {order?.currencySign}
                  {order?.price}
                </span>
              }
            />
            <List.Item title="數量" extra={order?.amount + ' USDT'} />
            <List.Item
              title="訂單號"
              extra={
                <div className="flex items-center">
                  <span className="mr-2">{order?.orderId}</span>
                  <SvgCopy className="h-4" />
                </div>
              }
            />
            <List.Item title="訂單時間" extra={stringDateFormat(order?.createTime)} />
            <List.Item
              title={names.nickName}
              extra={
                <div className="flex items-center">
                  {!!order?.showUserLogo && (
                    <img alt="" src={order?.showUserLogo} className=" w-5 h-5" />
                  )}
                  <span className="ml-2">{order?.showUserName}</span>
                </div>
              }
              onClick={() => {
                //
              }}
            />
            <List.Item title={names.name} extra={order?.showRealName} />
            <List.Item
              title="收款方式"
              extra={
                !!receipt && (
                  <div className="flex items-center">
                    <img alt="" src={receipt.receiptLogo} className="w-5 h-5" />
                    <span className="ml-2">{receipt.receiptTypeValue}</span>
                  </div>
                )
              }
            />
          </List>
        </div>
      </Container>

      <OrderCancelDialog
        open={action === 'cancel'}
        onClose={() => setAction(undefined, 'replaceIn')}
        onSubmit={() => otcCancelOrder.mutate({ data: { orderId: orderId ?? '' } })}
      />
    </Screen>
  );
};

const Container = styled.div`
  .adm-list-body {
    border: 0;
    .adm-list-item-title {
      color: #3d3a50;
    }
    .adm-list-item-content-extra {
      color: #1a1717;
      font-weight: bold;
    }
  }
`;

export default LegalOrderInfo;
