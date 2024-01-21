import { Button, List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import {
  useOtcGetOrderDetail,
  useOtcToMarkPayOrderSuccess,
  useOtcToPayOrder,
} from '../../api/endpoints/transformer';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { ReactComponent as SvgContactOther } from '../../assets/ic_svg_contact_other.svg';
import { ReactComponent as SvgCopy } from '../../assets/ic_svg_copy.svg';
import { ReactComponent as SvgOtcMark } from '../../assets/ic_svg_otc_mark.svg';
import { ReactComponent as SvgOtcShowUserTip } from '../../assets/ic_svg_otc_show_user_tip.svg';

import Screen from '../../components/Screen';
import InOutMarkDialog from './InOutMarkDialog';

// TODO 統一解決複製字符串

const LegalPay = () => {
  const [orderId] = useQueryParam('orderId', StringParam);
  const [showUserId] = useQueryParam('showUserId', StringParam);
  const [paymentId] = useQueryParam('paymentId', StringParam);
  const [action, setAction] = useQueryParam('action', StringParam);

  const { data: getOrderDetail } = useOtcGetOrderDetail(
    { orderId: orderId ?? '' },
    {
      query: {
        enabled: !!orderId,
      },
    }
  );

  const order = useMemo(
    () => getOrderDetail?.data?.order,
    [getOrderDetail?.data?.order]
  );

  const { data: toPayOrder } = useOtcToPayOrder(
    {
      orderId: orderId ?? '',
      showUserId: showUserId ?? '',
      showPaymentId: paymentId ?? '',
    },
    {
      query: {
        enabled: !!(order?.orderId && showUserId && paymentId),
      },
    }
  );

  const payResult = useMemo(
    () => toPayOrder?.data?.orderToPayResult,
    [toPayOrder?.data?.orderToPayResult]
  );

  const history = useHistory();

  const otcToMarkPayOrderSuccess = useOtcToMarkPayOrderSuccess({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);

          history.replace({
            pathname: '/legal-order-info',
            search: stringify({
              orderId,
            }),
          });
        }
      },
    },
  });

  const intl = useIntl();

  return (
    <Screen
      right={
        <div className="flex items-center justify-end">
          <Link
            to={{
              pathname: '/otc-chat',
              search: stringify({ orderId, nickName: payResult?.showUserName }),
            }}
          >
            <SvgContactOther className=" h-5 w-5" />
          </Link>
        </div>
      }
      footer={
        <div className="p-4">
          <Button
            block
            color="primary"
            onClick={() => {
              setAction('confirm', 'replaceIn');
            }}
          >
            {intl.formatMessage({
              defaultMessage: '我已付款成功',
              id: 'XWzDpA',
            })}
          </Button>
        </div>
      }
    >
      <Container className="flex flex-1 flex-col  overflow-y-auto">
        <div className="border-b py-4">
          <div className="text-center text-[#1A1717]">
            {intl.formatMessage({ defaultMessage: '向賣家付款', id: 'sNmNjz' })}
          </div>
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold text-[#3D3A50]">
              {payResult?.currencySign ?? ''}
              {payResult?.tolPrice}
            </span>
            <SvgCopy className="ml-2 mt-2 h-4 w-4" />
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs text-[#3D3A50]">
              {intl.formatMessage({
                defaultMessage: '付款時間剩餘',
                id: 'nIpnLv',
              })}
            </span>
            <span className="ml-1 text-[#6175AE]">
              <Countdown
                date={Date.now() + Number(payResult?.paySecondTime || 0) * 1000}
                renderer={({ days, hours, minutes, seconds }) => {
                  return (
                    <span>
                      {[days, hours, minutes, seconds]
                        .filter(Boolean)
                        .map(zeroPad)
                        .join(':')}
                    </span>
                  );
                }}
                onComplete={() => {
                  // Toast.show(
                  //   intl.formatMessage({
                  //     defaultMessage: '訂單已經超時',
                  //     id: '9x6bNN',
                  //   })
                  // );
                }}
              />
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center text-center">
            <span className="flex h-6 items-center justify-center rounded-xl bg-[#f1f3ff] px-4 text-xs text-[#3D3A50]">
              {payResult?.payTip}
            </span>
          </div>
        </div>

        <a className="border-b px-8 py-4">
          <div className="flex items-center">
            <img
              alt=""
              src={payResult?.showUserLogo ?? ''}
              className="h-6 w-6 overflow-hidden rounded-full"
            />
            <span className="ml-2 mr-4 flex-1 font-bold text-[#1A1717]">
              {payResult?.showUserName}
            </span>
            <Arrow />
          </div>

          <div className="mt-4 flex flex-wrap text-[#9A9A9A] ">
            {payResult?.showUserTip?.split('，').map((v, i) => (
              <div className="mb-2 mr-2 flex items-center" key={i}>
                <SvgOtcShowUserTip className="h-4 w-4" />
                <span className="ml-1 text-xs">{v}</span>
              </div>
            ))}
          </div>
        </a>

        <List>
          <List.Item
            title={intl.formatMessage({
              defaultMessage: '買家姓名',
              id: '1y6X+M',
            })}
            extra={
              <div className="flex items-center">
                {payResult?.showRealName}
                <SvgCopy className="ml-1 h-4 w-4" />
              </div>
            }
          />
          <List.Item
            title={intl.formatMessage(
              { defaultMessage: '{receiptTypeValue}號', id: 'HEzFXJ' },
              { receiptTypeValue: payResult?.receiptTypeValue }
            )}
            extra={
              <div className="flex items-center">
                {payResult?.receiptNo}
                <SvgCopy className="ml-1 h-4 w-4" />
              </div>
            }
          />
          <List.Item
            title={intl.formatMessage({
              defaultMessage: '開戶銀行',
              id: 'Telt8H',
            })}
            extra={
              <div className="flex items-center">
                {payResult?.bankName}
                <SvgCopy className="ml-1 h-4 w-4" />
              </div>
            }
          />
        </List>

        <div className=" mx-5 my-12 flex items-center rounded-md border border-dashed border-[#6175AE] bg-[#fef7ef] px-5 py-2">
          <SvgOtcMark className="h-4 w-4" />
          <span className="pl-2 text-xs text-[#6175AE]">
            {payResult?.alertTip}
          </span>
        </div>
      </Container>

      <InOutMarkDialog
        open={action === 'confirm'}
        onClose={() => setAction(undefined, 'replaceIn')}
        onSubmit={() => {
          otcToMarkPayOrderSuccess.mutate({
            data: { orderId: payResult?.orderId ?? '' },
          });
        }}
      />
    </Screen>
  );
};

const Container = styled.div`
  .adm-list-body,
  .adm-list-item-content {
    border: 0;

    .adm-list-item-title {
      color: #3d3a50;
      font-size: 14px;
    }

    .adm-list-item-content-extra {
      color: #1a1717;
      font-size: 14px;
    }
  }
`;

export default LegalPay;
