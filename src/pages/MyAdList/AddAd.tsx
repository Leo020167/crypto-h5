import { Button, Input, Selector, TextArea, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import {
  useOtcAddMyAd,
  useOtcFindMyPaymentList,
  useOtcGetAdPrice,
  useOtcGetMyAdInfo,
  useOtcUpdateMyAd,
} from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import { getReceipts } from '../../utils/response';
import MultiSelectQuickPayWay from './MultiSelectQuickPayWay';

const AddAd = () => {
  const [adId] = useQueryParam('adId', StringParam);
  const { data: findMyPaymentList } = useOtcFindMyPaymentList();

  const [payWay, setPayWay] = useState<string[]>([]);
  const [buySell, setBuySell] = useState<string>('buy');

  const [price, setPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [minCny, setMinCny] = useState<string>('');
  const [maxCny, setMaxCny] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useOtcGetMyAdInfo(
    { adId: adId ?? '' },
    {
      query: {
        enabled: !!adId,
        onSuccess(data) {
          if (data.data) {
            const info = data.data;
            setBuySell(info.buySell ?? '');
            setPrice(info.price ?? '');
            setAmount(info.amount ?? '');
            setMinCny(info.minCny ?? '');
            setMaxCny(info.maxCny ?? '');
            setContent(info.content ?? '');

            const receipts = getReceipts(info.payWay);

            setPayWay(receipts.map((v) => v.paymentId ?? ''));
          }
        },
      },
    },
  );

  const { data: getAdPrice } = useOtcGetAdPrice(
    {
      buySell,
    },
    {
      query: {
        enabled: !!buySell,
      },
    },
  );

  const history = useHistory();

  const otcUpdateMyAd = useOtcUpdateMyAd({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.replace('/my-ad-list');
        }
      },
    },
  });

  const otcAddMyAd = useOtcAddMyAd({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.replace('/my-ad-list');
        }
      },
    },
  });

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!price || !price.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入價格', id: 'bW0/mN' }));
      return;
    }
    if (!amount || !amount.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入數量', id: 'CuGKWh' }));
      return;
    }
    if (!minCny || !minCny.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入最小限額', id: '3yGSyj' }));
      return;
    }
    if (!maxCny || !maxCny.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入最大限額', id: 'LLn6Tg' }));
      return;
    }

    if (!payWay.length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請選擇收付款方式', id: '7oGHtt' }));
      return;
    }
    if (content?.length > 140) {
      Toast.show(intl.formatMessage({ defaultMessage: '留言長度不能大於140個字符', id: 'kSaqSM' }));
      return;
    }

    if (adId) {
      otcUpdateMyAd.mutate({
        data: {
          buySell,
          price,
          minCny,
          maxCny,
          amount,
          payWay: payWay.join(','),
          content,
          adId: adId ?? '',
        },
      });
    } else {
      otcAddMyAd.mutate({
        data: {
          buySell,
          price,
          minCny,
          maxCny,
          amount,
          payWay: payWay.join(','),
          content,
        },
      });
    }
  }, [
    adId,
    amount,
    buySell,
    content,
    intl,
    maxCny,
    minCny,
    otcAddMyAd,
    otcUpdateMyAd,
    payWay,
    price,
  ]);

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '添加廣告', id: 'ASHrJh' })}
      footer={
        <div className="p-4">
          <Button block color="primary" onClick={handleFinish}>
            {intl.formatMessage({ defaultMessage: '確認發佈', id: 'r2AYLr' })}
          </Button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto">
        <div className="mt-6 px-4 flex items-center">
          <div className="font-bold w-10">
            {intl.formatMessage({ defaultMessage: '我想', id: 'etzvPz' })}
          </div>
          <Selector
            value={[buySell]}
            columns={2}
            className="flex-1"
            options={[
              {
                label: intl.formatMessage({ defaultMessage: '充值', id: 'HLQK6J' }),
                value: 'buy',
              },
              {
                label: intl.formatMessage({ defaultMessage: '提現', id: '0vOXLz' }),
                value: 'sell',
              },
            ]}
            showCheckMark={false}
            onChange={(value) => {
              if (value.length) {
                setBuySell(value[0] as string);
              }
            }}
          />
          <div className="ml-4 font-bold">USDT</div>
        </div>

        <div className="px-4 flex items-center mt-6">
          <div className="font-bold w-10">
            {intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
          </div>
          <div className="relative flex items-center flex-1">
            <Input
              className="h-12 border pl-4 pr-14"
              placeholder="輸入價格"
              value={price}
              onChange={setPrice}
            />
            <span className="absolute right-4 text-[#9A9A9A] text-xs">HKD/USDT</span>
          </div>
        </div>

        <div className="pl-14 mt-2 text-xs text-[#9A9A9A]">
          {'buy' === buySell
            ? intl.formatMessage({ defaultMessage: '當前購買最高價', id: 'CbGK63' })
            : intl.formatMessage({ defaultMessage: '當前提現最低價', id: 'VC4lRg' })}
          <span className="mx-1 text-[#6175AE]" key="bestPriceHint">
            {getAdPrice?.data?.price ?? '0.00'}
          </span>
          <span className="mx-1">HKD/USDT</span>
          <a className="mx-1 text-[#6175AE]">
            {intl.formatMessage({ defaultMessage: '填入', id: 'p8CmvE' })}
          </a>
        </div>

        <div className="px-4 flex items-center mt-6">
          <div className="font-bold w-10">
            {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
          </div>
          <div className="relative flex items-center flex-1">
            <Input
              className=" h-12 border pl-4 pr-14"
              placeholder={intl.formatMessage({ defaultMessage: '輸入數量', id: 'KCC04w' })}
              value={amount}
              onChange={setAmount}
            />
            <span className="absolute right-4 text-[#9A9A9A] text-xs">USDT</span>
          </div>
        </div>

        <div className="pl-14 mt-2 text-xs text-[#9A9A9A]">
          {intl.formatMessage({
            defaultMessage: '提現USDT時系統將會從餘額賬戶中凍結該部分資金',
            id: 'kOFx5M',
          })}
        </div>

        <div className="px-4 flex items-center mt-6">
          <div className="font-bold w-10">
            {intl.formatMessage({
              defaultMessage: '限額',
              id: 'zGwnHi',
            })}
          </div>
          <div className="flex items-center flex-1">
            <div className="relative flex items-center">
              <Input
                className="h-12 border pl-4 pr-10"
                placeholder={intl.formatMessage({ defaultMessage: '最小', id: 'pKUW2A' })}
                value={minCny}
                onChange={setMinCny}
              />
              <span className="absolute right-4 text-[#9A9A9A] text-xs">HKD</span>
            </div>
            <span className="mx-2">-</span>
            <div className="relative flex items-center">
              <Input
                className=" h-12 border pl-4 pr-10"
                placeholder={intl.formatMessage({ defaultMessage: '最大', id: 'BSPQ7h' })}
                value={maxCny}
                onChange={setMaxCny}
              />
              <span className="absolute right-4 text-[#9A9A9A] text-xs">HKD</span>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="font-bold">
            {intl.formatMessage({ defaultMessage: '方式（可多選）', id: 'tNR1ps' })}
          </div>
          <div className="mt-4">
            <MultiSelectQuickPayWay
              value={payWay}
              onChange={setPayWay}
              receipts={findMyPaymentList?.data?.myPaymentList}
            />
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="font-bold">
            {intl.formatMessage({ defaultMessage: '留言內容', id: 'xKofLL' })}
          </div>
          <div className="h-24">
            <TextArea
              value={content}
              onChange={setContent}
              className="border mt-4 rounded p-2 h-full"
              placeholder={intl.formatMessage({
                defaultMessage: '請寫下您想對賣家/買家說的話！（限140字）',
                id: '7Km8jt',
              })}
            />
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default AddAd;
