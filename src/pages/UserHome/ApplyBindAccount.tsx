import { Button, Dialog, Input, Popup, Radio, Toast } from 'antd-mobile';
import { useCallback, useMemo, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';
import { useApplyForFollow, useGetFollowTypes } from '../../api/endpoints/transformer';
import { FollowType } from '../../api/model';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';

const ApplyBindAccount = () => {
  const [userId] = useQueryParam('userId', StringParam);

  const [open, setOpen] = useState(false);

  const [typeId, setTypeId] = useState<string>();

  const [multiple, setMultiple] = useState('');

  const { data, refetch } = useGetFollowTypes(
    {
      dvUid: userId ?? '',
    },
    {
      query: {
        enabled: !!userId,
        onSuccess(data) {
          if (data.code === '200') {
            setTypeId(data?.data?.data?.types?.find((v) => v.isBind === '1')?.id);
          }
        },
      },
    },
  );

  const getExpireTime = useCallback((t: FollowType) => {
    if (t.isBind === '1') {
      return (
        <div className="flex flex-col">
          <span>到期時間</span>
          <span className="text-black">{stringDateFormat(t.expireTime)}</span>
        </div>
      );
    }
    return null;
  }, []);

  const followType = useMemo(
    () => data?.data?.data?.types?.find((v) => v.id === typeId),
    [data?.data?.data?.types, typeId],
  );

  const applyForFollow = useApplyForFollow({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setOpen(false);
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!multiple || !multiple.trim().length) {
      Toast.show('請輸入倍數');
      return;
    }

    const val = Number(multiple);

    if (followType?.maxMultiNum && val > Number(followType?.maxMultiNum)) {
      Toast.show(`輸入跟單倍數不能大於${followType?.maxMultiNum}`);
      return;
    }

    if (followType?.minMultiNum && val < Number(followType?.minMultiNum)) {
      Toast.show(`輸入跟單倍數不能小於${followType?.minMultiNum}`);
      return;
    }

    applyForFollow.mutate({
      data: {
        dvUid: userId ?? '',
        typeId: typeId,
        multiNum: multiple,
      },
    });
  }, [applyForFollow, followType?.maxMultiNum, followType?.minMultiNum, multiple, typeId, userId]);

  return (
    <Screen headerTitle="申请绑定">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <Radio.Group
          value={typeId}
          onChange={(val) => {
            console.log(val);
            setTypeId(val as string);
          }}
        >
          {data?.data?.data?.types?.map((v, i) => (
            <div key={v.id} className="p-4 bg-white rounded-md">
              <div className="text-[#666666]">
                <Radio
                  value={v.id}
                  style={{
                    '--icon-size': '18px',
                    '--font-size': '14px',
                    '--gap': '6px',
                  }}
                >
                  跟單類型{i + 1}
                </Radio>

                <div className="flex items-center justify-between">
                  <span>盈利分成:{v.profitRate}%</span>
                  <span>虧損補貼:{v.lossRate}%</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span>最高倍數:{v.maxMultiNum}</span>
                  <span>消耗TFU:{v.tokenAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>最低金額</span>
                    <span className="text-black">{v.limit}USDT</span>
                  </div>
                  {getExpireTime(v)}
                  {!!v.duration && (
                    <div className="flex flex-col items-end">
                      <span>時間</span>
                      <span className="text-black">{v.duration}天</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Radio.Group>

        {data?.data?.data?.showBind === '1' && (
          <div className="mt-5">
            <a
              className="bg-[#ff6b1b] h-10 flex items-center justify-center text-white rounded-md"
              onClick={() => {
                Dialog.alert({
                  title: '風險提示書',
                  closeOnMaskClick: true,
                  content: (
                    <div className="h-64">
                      <iframe
                        className="w-full h-full overflow-y-auto"
                        title="風險提示書"
                        src="http://api.piglobalexchanges.com/procoin/article/#/passgeDetail?article_id=66"
                      />
                    </div>
                  ),
                  confirmText: '我已閲讀並同意',
                  onConfirm() {
                    setOpen(true);
                  },
                });
              }}
            >
              確定
            </a>
          </div>
        )}
      </div>

      <Popup position="bottom" visible={open} onClose={() => setOpen(false)} closeOnMaskClick>
        <div className="p-4">
          <div className=" h-16 text-base">跟單倍數設置</div>

          <div className="flex items-center text-base">
            <span className="text-gray-400">倍數</span>
            <Input
              value={multiple}
              onChange={setMultiple}
              type="number"
              className="flex-1 h-11 border-b px-2"
              min={0}
              step={1}
              maxLength={15}
              placeholder="請輸入正整數"
            />
            <span className="text-gray-400">倍</span>
          </div>

          <Button block color="primary" className="my-8" onClick={handleFinish}>
            確定
          </Button>
        </div>
      </Popup>
    </Screen>
  );
};

export default ApplyBindAccount;
