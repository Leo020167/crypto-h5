import { Button, Input, Selector, TextArea, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
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

  const handleFinish = useCallback(() => {
    if (!price || !price.trim().length) {
      Toast.show('請輸入價格');
      return;
    }
    if (!amount || !amount.trim().length) {
      Toast.show('請輸入數量');
      return;
    }
    if (!minCny || !minCny.trim().length) {
      Toast.show('請輸入最小限額');
      return;
    }
    if (!maxCny || !maxCny.trim().length) {
      Toast.show('請輸入最大限額');
      return;
    }

    if (!payWay.length) {
      Toast.show('請選擇收付款方式');
      return;
    }
    if (content?.length > 140) {
      Toast.show('留言長度不能大於140個字符');
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
  }, [adId, amount, buySell, content, maxCny, minCny, otcAddMyAd, otcUpdateMyAd, payWay, price]);

  return (
    <Screen
      headerTitle="添加廣告"
      footer={
        <div className="p-4">
          <Button block color="primary" onClick={handleFinish}>
            確認發佈
          </Button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto">
        <div className="mt-6 px-4 flex items-center">
          <div className="font-bold w-10">我想</div>
          <Selector
            value={[buySell]}
            columns={2}
            className="flex-1"
            options={[
              {
                label: '購買',
                value: 'buy',
              },
              {
                label: '出售',
                value: 'sell',
              },
            ]}
            showCheckMark={false}
            onChange={(value) => {
              console.log(value);
              if (value.length) {
                setBuySell(value[0] as string);
              }
            }}
          />
          <div className="ml-4 font-bold">USDT</div>
        </div>

        <div className="px-4 flex items-center mt-6">
          <div className="font-bold w-10">價格</div>
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
          {'buy' === buySell ? '當前購買最高價' : '當前出售最低價'}
          <span className="mx-1 text-[#6175AE]" key="bestPriceHint">
            {getAdPrice?.data?.price ?? '0.00'}
          </span>
          <span className="mx-1">HKD/USDT</span>
          <a className="mx-1 text-[#6175AE]">填入</a>
        </div>

        <div className="px-4 flex items-center mt-6">
          <div className="font-bold w-10">數量</div>
          <div className="relative flex items-center flex-1">
            <Input
              className=" h-12 border pl-4 pr-14"
              placeholder="輸入數量"
              value={amount}
              onChange={setAmount}
            />
            <span className="absolute right-4 text-[#9A9A9A] text-xs">USDT</span>
          </div>
        </div>

        <div className="pl-14 mt-2 text-xs text-[#9A9A9A]">
          出售USDT時系統將會從餘額賬戶中凍結該部分資金
        </div>

        <div className="px-4 flex items-center mt-6">
          <div className="font-bold w-10">限額</div>
          <div className="flex items-center flex-1">
            <div className="relative flex items-center">
              <Input
                className="h-12 border pl-4 pr-10"
                placeholder="最小"
                value={minCny}
                onChange={setMinCny}
              />
              <span className="absolute right-4 text-[#9A9A9A] text-xs">HKD</span>
            </div>
            <span className="mx-2">-</span>
            <div className="relative flex items-center">
              <Input
                className=" h-12 border pl-4 pr-10"
                placeholder="最大"
                value={maxCny}
                onChange={setMaxCny}
              />
              <span className="absolute right-4 text-[#9A9A9A] text-xs">HKD</span>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="font-bold">方式（可多選）</div>
          <div className="mt-4">
            <MultiSelectQuickPayWay
              value={payWay}
              onChange={setPayWay}
              receipts={findMyPaymentList?.data?.myPaymentList}
            />
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="font-bold">留言內容</div>
          <div className="h-24">
            <TextArea
              value={content}
              onChange={setContent}
              className="border mt-4 rounded p-2 h-full"
              placeholder="請寫下您想對賣家/買家說的話！（限140字）"
            />
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default AddAd;
