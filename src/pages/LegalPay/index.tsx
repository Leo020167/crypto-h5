import { Button, List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import {
  useOtcGetOrderDetail,
  useOtcToMarkPayOrderSuccess,
  useOtcToPayOrder,
} from '../../api/endpoints/transformer';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { ReactComponent as SvgCopy } from '../../assets/ic_svg_copy.svg';
import { ReactComponent as SvgOtcMark } from '../../assets/ic_svg_otc_mark.svg';
import { ReactComponent as SvgOtcShowUserTip } from '../../assets/ic_svg_otc_show_user_tip.svg';
import Countdown from '../../components/Countdown';
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
    },
  );

  const order = useMemo(() => getOrderDetail?.data?.order, [getOrderDetail?.data?.order]);

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
    },
  );

  const payResult = useMemo(
    () => toPayOrder?.data?.orderToPayResult,
    [toPayOrder?.data?.orderToPayResult],
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
      footer={
        <div className="p-4">
          <Button
            block
            color="primary"
            onClick={() => {
              setAction('confirm', 'replaceIn');
            }}
          >
            {intl.formatMessage({ defaultMessage: '我已付款成功', id: 'XWzDpA' })}
          </Button>
        </div>
      }
    >
      <Container className="flex-1 flex flex-col  overflow-y-auto">
        <div className="border-b py-4">
          <div className="text-[#1A1717] text-center">
            {intl.formatMessage({ defaultMessage: '向賣家付款', id: 'sNmNjz' })}
          </div>
          <div className="flex items-center justify-center">
            <span className="text-[#3D3A50] text-4xl font-bold">
              {payResult?.currencySign ?? ''}
              {payResult?.tolPrice}
            </span>
            <SvgCopy className="w-4 h-4 ml-2 mt-2" />
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs text-[#3D3A50]">
              {intl.formatMessage({ defaultMessage: '付款時間剩餘', id: 'nIpnLv' })}
            </span>
            <span className="text-[#6175AE] ml-1">
              <Countdown
                time={payResult?.paySecondTime}
                onFinish={() => {
                  Toast.show(intl.formatMessage({ defaultMessage: '訂單已經超時', id: '9x6bNN' }));
                }}
              />
            </span>
          </div>

          <div className="text-center flex items-center justify-center mt-2">
            <span className="text-[#3D3A50] text-xs rounded-xl bg-[#f1f3ff] px-4 h-6 flex items-center justify-center">
              {payResult?.payTip}
            </span>
          </div>
        </div>

        <a className="py-4 px-8 border-b">
          <div className="flex items-center">
            <img
              alt=""
              src={payResult?.showUserLogo ?? ''}
              className="w-6 h-6 rounded-full overflow-hidden"
            />
            <span className="flex-1 font-bold text-[#1A1717] ml-2 mr-4">
              {payResult?.showUserName}
            </span>
            <Arrow />
          </div>

          <div className="mt-4 flex text-[#9A9A9A] flex-wrap ">
            {payResult?.showUserTip?.split('，').map((v, i) => (
              <div className="flex items-center mr-2 mb-2" key={i}>
                <SvgOtcShowUserTip className="w-4 h-4" />
                <span className="text-xs ml-1">{v}</span>
              </div>
            ))}
          </div>
        </a>

        <List>
          <List.Item
            title={intl.formatMessage({ defaultMessage: '買家姓名', id: '1y6X+M' })}
            extra={
              <div className="flex items-center">
                {payResult?.showRealName}
                <SvgCopy className="w-4 h-4 ml-1" />
              </div>
            }
          />
          <List.Item
            title={intl.formatMessage(
              { defaultMessage: '{receiptTypeValue}號', id: 'HEzFXJ' },
              { receiptTypeValue: payResult?.receiptTypeValue },
            )}
            extra={
              <div className="flex items-center">
                {payResult?.receiptNo}
                <SvgCopy className="w-4 h-4 ml-1" />
              </div>
            }
          />
          <List.Item
            title={intl.formatMessage({ defaultMessage: '開戶銀行', id: 'Telt8H' })}
            extra={
              <div className="flex items-center">
                {payResult?.bankName}
                <SvgCopy className="w-4 h-4 ml-1" />
              </div>
            }
          />
        </List>

        <div className=" my-12 mx-5 px-5 py-2 border border-[#6175AE] border-dashed rounded-md flex items-center bg-[#fef7ef]">
          <SvgOtcMark className="h-4 w-4" />
          <span className="text-xs pl-2 text-[#6175AE]">{payResult?.alertTip}</span>
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
