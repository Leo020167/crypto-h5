import { Button, List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useOtcCancelOrder, useOtcGetOrderDetail } from '../../api/endpoints/transformer';
import { Order, Receipt } from '../../api/model';
import { ReactComponent as SvgContactOther } from '../../assets/ic_svg_contact_other.svg';
import { ReactComponent as SvgCopy } from '../../assets/ic_svg_copy.svg';
import { ReactComponent as SvgOtcFalse } from '../../assets/ic_svg_otc_false.svg';
import { ReactComponent as SvgOtcSuccess } from '../../assets/ic_svg_otc_success.svg';
import { ReactComponent as SvgTime } from '../../assets/ic_svg_time.svg';

import Countdown from '../../components/Countdown';
import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
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
      return <Clock time={order.paySecondTime} onFinish={onFinish} />;
    }
  }

  if (OtcOrderState.mark === order.state) {
    if (isBuyer) {
      return <Clock time={order.paySecondTime} onFinish={onFinish} />;
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

  const { userInfo } = useAuthStore();
  const isBuyer = useMemo(
    () => !!userInfo?.userId && !!order?.buyUserId && userInfo?.userId === order?.buyUserId,
    [order?.buyUserId, userInfo?.userId],
  );

  const intl = useIntl();

  const names = useMemo(() => {
    return isBuyer
      ? {
          nickName: intl.formatMessage({ defaultMessage: '賣家暱稱', id: 'Qka2kz' }),
          name: intl.formatMessage({ defaultMessage: '賣家姓名', id: '3Ced22' }),
        }
      : {
          nickName: intl.formatMessage({ defaultMessage: '買家暱稱', id: 'Tq9EwF' }),
          name: intl.formatMessage({ defaultMessage: '參數錯誤', id: 'rpJLsF' }),
        };
  }, [intl, isBuyer]);

  const history = useHistory();

  const footer = useMemo(() => {
    if (order?.state === OtcOrderState.wait) {
      if (isBuyer) {
        return (
          <div className="flex p-4">
            <Button block onClick={() => setAction('cancel', 'replaceIn')}>
              {intl.formatMessage({ defaultMessage: '取消訂單', id: 'NNH82R' })}
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
                    showUserId: order?.showUserId,
                    paymentId: receipt?.paymentId,
                  }),
                });
              }}
            >
              {intl.formatMessage({ defaultMessage: '去付款', id: 'KAHC21' })}
            </Button>
          </div>
        );
      } else {
        return (
          <div className="flex p-4">
            <Button key="receivedConfirm" block color="primary" disabled>
              {intl.formatMessage({ defaultMessage: '我確認收到付款', id: '+9Acwm' })}
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
              {intl.formatMessage({ defaultMessage: '申訴', id: 'qSm4kD' })}
            </Button>
          </div>
        );
      } else {
        <div className="flex p-4">
          <Button block color="primary" className="ml-4">
            {intl.formatMessage({ defaultMessage: '我確認收到付款', id: '+9Acwm' })}
          </Button>
        </div>;
      }
    }

    return null;
  }, [
    history,
    intl,
    isBuyer,
    order?.showUserId,
    order?.state,
    orderId,
    receipt?.paymentId,
    setAction,
  ]);

  const handleTimeout = useCallback(() => {
    Toast.show(intl.formatMessage({ defaultMessage: '訂單已經超時', id: '9x6bNN' }));
    refetch();
  }, [intl, refetch]);

  const header = useMemo(() => {
    return (
      <div className="p-4 flex items-center justify-between border-b border-[#EEEEEE]">
        <div>
          <span className=" text-2xl font-bold text-[#3D3A50]">{order?.stateValue}</span>
          <div className="text-xs mt-2">
            {tips}
            {order?.state === OtcOrderState.wait && isBuyer && (
              <span className="text-[#6175AE]">
                <Countdown time={order.paySecondTime} onFinish={handleTimeout} />
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
    <Screen
      right={
        <div className="flex items-center justify-end">
          <Link to={{ pathname: '/otc-chat', search: stringify({ orderId }) }}>
            <SvgContactOther className=" w-5 h-5" />
          </Link>
        </div>
      }
      footer={footer}
    >
      <Container className="flex-1 overflow-y-auto">
        {header}
        <div className="my-4">
          <span className="text-base font-bold text-[#3D3A50] p-4">
            {order?.buySellValue ?? '--'}
          </span>
          <List className="mt-4">
            <List.Item
              title={intl.formatMessage({ defaultMessage: '總價', id: 'XkGx1k' })}
              extra={
                <span className="text-[#6175AE] font-bold text-xl">
                  {order?.currencySign}
                  {order?.tolPrice}
                </span>
              }
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
              extra={
                <span>
                  {order?.currencySign}
                  {order?.price}
                </span>
              }
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
              extra={order?.amount + ' USDT'}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '訂單號', id: 'DSV3lz' })}
              extra={
                <div className="flex items-center">
                  <span className="mr-2">{order?.orderId}</span>
                  <SvgCopy className="h-4" />
                </div>
              }
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '訂單時間', id: '42JqYW' })}
              extra={stringDateFormat(order?.createTime)}
            />
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
              title={intl.formatMessage({ defaultMessage: '收款方式', id: 'UA7E9h' })}
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
