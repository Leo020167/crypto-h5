import { Button, Dialog, Form, Input, List, Popup, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
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
    return '---';
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

  const intl = useIntl();

  return (
    <Screen
      headerTitle={order?.symbol}
      footer={
        <div className="flex gap-4 p-4">
          <Button
            block
            onClick={() => setOpenClosePosition(true)}
            disabled={order?.closeDone == '1' || order?.openDone !== '1'}
          >
            {intl.formatMessage({ defaultMessage: '普通平倉', id: 'mGf323' })}
          </Button>
          <Button
            block
            disabled={order?.closeDone == '1' || order?.openDone !== '1'}
            color="primary"
            onClick={() => {
              Dialog.confirm({
                content: intl.formatMessage(
                  { defaultMessage: '是否以當前市價平倉{openHand}？', id: 'KCMRBl' },
                  { openHand: order?.openHand },
                ),
                confirmText: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
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
          <div className="text-sm ">
            {intl.formatMessage({ defaultMessage: '盈利(USDT)', id: 'aaQVo1' })}
          </div>
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
            <List.Item
              title={intl.formatMessage({ defaultMessage: '盈開倉價', id: '8OyLEv' })}
              extra={order?.openPrice}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '開倉方向', id: 'nLab+i' })}
              extra={
                <span style={{ color: getColor(order?.buySell === 'buy' ? 1 : -1) }}>
                  {order?.buySellValue}
                </span>
              }
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '持倉保證金', id: 'KyHiY3' })}
              extra={order?.openBail}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '持倉手數', id: 'KNgmr/' })}
              extra={order?.openHand}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '開倉手續費', id: 'YJwfmY' })}
              extra={order?.openFee}
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '開倉時間', id: 'W+d7SX' })}
              extra={stringDateFormat(order?.openTime)}
            />
            <List.Item
              title={
                <div className="flex items-center">
                  {intl.formatMessage({ defaultMessage: '止盈價格', id: 'cde9b7' })}
                  <a
                    onClick={() => setOpenStopWin(true)}
                    className="w-11 ml-4 bg-[#E2214E] text-white rounded text-xs h-5 flex items-center justify-center"
                  >
                    {intl.formatMessage({ defaultMessage: '設置', id: '+eQ50+' })}
                  </a>
                </div>
              }
              extra={
                order?.stopWinPrice === '0'
                  ? intl.formatMessage({ defaultMessage: '無設置', id: 'sofNEv' })
                  : order?.stopWinPrice
              }
            />
            <List.Item
              title={
                <div className="flex items-center">
                  {intl.formatMessage({ defaultMessage: '止損價格', id: 'dhfg6B' })}
                  <a
                    onClick={() => setOpenSetLoss(true)}
                    className="w-11 ml-4 bg-[#00AD88] text-white rounded text-xs h-5 flex items-center justify-center"
                  >
                    {intl.formatMessage({ defaultMessage: '設置', id: '+eQ50+' })}
                  </a>
                </div>
              }
              extra={
                order?.stopLossPrice === '0'
                  ? intl.formatMessage({ defaultMessage: '無設置', id: 'sofNEv' })
                  : order?.stopLossPrice
              }
            />
            <List.Item
              title={intl.formatMessage({ defaultMessage: '開倉狀態', id: 'egvBG/' })}
              extra={order?.nowStateDesc}
            />
            <List.Item
              title={intl.formatMessage(
                { defaultMessage: '{symbol}現價', id: 'DRC113' },
                {
                  symbol: order?.symbol,
                },
              )}
              extra={nowPrice}
            />
          </List>
        </div>

        <div className="py-5 px-4">
          <div className="text-lg font-bold text-[#3d3a50] ">
            {intl.formatMessage({ defaultMessage: '平倉明細', id: '4V3iak' })}
          </div>
          {order?.closeDetails?.map((detail, index) => (
            <List className="mt-5" key={index}>
              <List.Item
                title={intl.formatMessage({ defaultMessage: '平倉盈虧', id: 'm3pyR6' })}
                extra={
                  <span style={{ color: getColor(Number(detail.profit)) }}>{detail?.profit}</span>
                }
              />
              <List.Item
                title={intl.formatMessage({ defaultMessage: '平倉價', id: 'e6wHOS' })}
                extra={detail?.closePrice}
              />
              <List.Item
                title={intl.formatMessage({ defaultMessage: '平倉手數', id: 'oEe/47' })}
                extra={detail?.closeHand}
              />
              <List.Item
                title={intl.formatMessage({ defaultMessage: '平倉手續費', id: 'QZyuPN' })}
                extra={detail?.closeFee}
              />
              <List.Item
                title={intl.formatMessage({ defaultMessage: '平倉時間', id: 'HOSYMH' })}
                extra={stringDateFormat(detail?.closeTime)}
              />

              <List.Item
                title={intl.formatMessage({ defaultMessage: '盈利分成:', id: '9+4/A7' })}
                extra={
                  Number(detail.profit) > 0 && detail.profitShare ? `-${detail.profitShare}` : '---'
                }
              />

              <List.Item
                title={intl.formatMessage({ defaultMessage: '虧損補貼:', id: 'HpbXNh' })}
                extra={Number(detail.profit) < 0 && detail.lossShare ? detail.lossShare : '---'}
              />
            </List>
          ))}
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
              {intl.formatMessage({ defaultMessage: '提交', id: 'ENPgS/' })}
            </Button>
          }
        >
          <Form.Header>
            {intl.formatMessage({ defaultMessage: '止盈設置', id: 'oRPjgd' })}
          </Form.Header>
          <Form.Item label={intl.formatMessage({ defaultMessage: '止盈價', id: 'u/gk22' })}>
            <Input
              type="number"
              maxLength={18}
              value={stopWin}
              onChange={setStopWin}
              placeholder={intl.formatMessage({ defaultMessage: '請輸入止盈價', id: '2yjenl' })}
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
              {intl.formatMessage({ defaultMessage: '提交', id: 'ENPgS/' })}
            </Button>
          }
        >
          <Form.Header>
            {intl.formatMessage({ defaultMessage: '止損設置', id: 'ep7sPi' })}
          </Form.Header>
          <Form.Item label={intl.formatMessage({ defaultMessage: '止損價', id: '5nalmK' })}>
            <Input
              type="number"
              maxLength={18}
              value={loss}
              onChange={setLoss}
              placeholder={intl.formatMessage({ defaultMessage: '請輸入止損價', id: 'kCvDNl' })}
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
              {intl.formatMessage({ defaultMessage: '提交', id: 'ENPgS/' })}
            </Button>
          }
        >
          <Form.Header>
            <span className="text-black">
              {intl.formatMessage({ defaultMessage: '普通平倉', id: 'mGf323' })}
            </span>
            <span className="text-xs">
              {intl.formatMessage({ defaultMessage: '(以當前市價成交)', id: 'B+wVLW' })}
            </span>
          </Form.Header>
          <div className="flex items-center mt-4">
            <Input
              type="number"
              max={Number(order?.openHand)}
              maxLength={18}
              value={closeHand}
              onChange={setCloseHand}
              placeholder={intl.formatMessage({ defaultMessage: '請輸入平倉手數', id: 'ZP7om0' })}
              className="border-b h-10"
            />
            <span className="text-sm">
              {intl.formatMessage({ defaultMessage: '手', id: 'ohYFAy' })}
            </span>
          </div>
          <div className="text-gray-400 text-xs mt-2">
            {intl.formatMessage(
              { defaultMessage: '持倉手數{openHand}', id: '91IYT/' },
              { opeenHand: order?.openHand },
            )}
          </div>
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
