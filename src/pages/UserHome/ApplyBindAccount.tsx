import { Button, Dialog, Input, Popup, Radio, Toast } from 'antd-mobile';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
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

  const intl = useIntl();

  const getExpireTime = useCallback(
    (t: FollowType) => {
      if (t.isBind === '1') {
        return (
          <div className="flex flex-col">
            <span>{intl.formatMessage({ defaultMessage: '到期時間', id: 'LZqmso' })}</span>
            <span className="text-black">{stringDateFormat(t.expireTime)}</span>
          </div>
        );
      }
      return null;
    },
    [intl],
  );

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
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入倍數', id: 'Bp4Dlk' }));
      return;
    }

    const val = Number(multiple);

    if (followType?.maxMultiNum && val > Number(followType?.maxMultiNum)) {
      Toast.show(
        intl.formatMessage(
          {
            defaultMessage: '輸入跟單倍數不能大於{maxMultiNum}',
            id: 'lrlCJ8',
          },
          { maxMultiNum: followType?.maxMultiNum },
        ),
      );
      return;
    }

    if (followType?.minMultiNum && val < Number(followType?.minMultiNum)) {
      Toast.show(
        intl.formatMessage(
          {
            defaultMessage: '輸入跟單倍數不能小於{minMultiNum}',
            id: 't/1bpl',
          },
          { maxMultiNum: followType?.minMultiNum },
        ),
      );
      return;
    }

    applyForFollow.mutate({
      data: {
        dvUid: userId ?? '',
        typeId: typeId,
        multiNum: multiple,
      },
    });
  }, [
    applyForFollow,
    followType?.maxMultiNum,
    followType?.minMultiNum,
    intl,
    multiple,
    typeId,
    userId,
  ]);

  return (
    <Screen
      headerTitle={intl.formatMessage({
        defaultMessage: '申请绑定',
        id: 'jB+/k7',
      })}
    >
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
                  {intl.formatMessage({
                    defaultMessage: '跟單類型',
                    id: 'xiR+G9',
                  })}
                  {i + 1}
                </Radio>

                <div className="flex items-center justify-between">
                  <span>
                    {intl.formatMessage({
                      defaultMessage: '盈利分成:',
                      id: '9+4/A7',
                    })}
                    {v.profitRate}%
                  </span>
                  <span>
                    {intl.formatMessage({
                      defaultMessage: '虧損補貼:',
                      id: 'HpbXNh',
                    })}
                    {v.lossRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span>
                    {intl.formatMessage({
                      defaultMessage: '最高倍數:',
                      id: 'Snj6vy',
                    })}
                    {v.maxMultiNum}
                  </span>
                  <span>
                    {intl.formatMessage({
                      defaultMessage: '最高倍消耗TFU:',
                      id: 'guM4xe',
                    })}
                    {v.tokenAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>
                      {intl.formatMessage({
                        defaultMessage: '最低金額',
                        id: '2S6+KD',
                      })}
                    </span>
                    <span className="text-black">{v.limit}USDT</span>
                  </div>
                  {getExpireTime(v)}
                  {!!v.duration && (
                    <div className="flex flex-col items-end">
                      <span>
                        {intl.formatMessage({
                          defaultMessage: '時間',
                          id: 'W6smHj',
                        })}
                      </span>
                      <span className="text-black">
                        {v.duration}
                        {intl.formatMessage({
                          defaultMessage: '天',
                          id: '0B0jPm',
                        })}
                      </span>
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
                  title: intl.formatMessage({
                    defaultMessage: '風險提示書',
                    id: 'A3Awd7',
                  }),
                  closeOnMaskClick: true,
                  content: (
                    <div className="h-64">
                      <iframe
                        className="w-full h-full overflow-y-auto"
                        title={intl.formatMessage({
                          defaultMessage: '風險提示書',
                          id: 'A3Awd7',
                        })}
                        src="http://api.piglobalexchanges.com/procoin/article/#/passgeDetail?article_id=66"
                      />
                    </div>
                  ),
                  confirmText: intl.formatMessage({
                    defaultMessage: '我已閲讀並同意',
                    id: '/EvoLI',
                  }),
                  onConfirm() {
                    setOpen(true);
                  },
                });
              }}
            >
              {intl.formatMessage({
                defaultMessage: '確定',
                id: 'ofc1Jv',
              })}
            </a>
          </div>
        )}
      </div>

      <Popup position="bottom" visible={open} onClose={() => setOpen(false)} closeOnMaskClick>
        <div className="p-4">
          <div className=" h-16 text-base">
            {intl.formatMessage({
              defaultMessage: '跟單倍數設置',
              id: 'KzQKst',
            })}
          </div>

          <div className="flex items-center text-base">
            <span className="text-gray-400">
              {intl.formatMessage({
                defaultMessage: '倍數',
                id: 'Vt3fSC',
              })}
            </span>
            <Input
              value={multiple}
              onChange={setMultiple}
              type="number"
              className="flex-1 h-11 border-b px-2"
              min={0}
              step={1}
              maxLength={15}
              placeholder={intl.formatMessage({
                defaultMessage: '請輸入正整數',
                id: '84nlVd',
              })}
            />
            <span className="text-gray-400">
              {intl.formatMessage({
                defaultMessage: '倍',
                id: 'Nlt2yU',
              })}
            </span>
          </div>

          <Button block color="primary" className="my-8" onClick={handleFinish}>
            {intl.formatMessage({
              defaultMessage: '確定',
              id: 'ofc1Jv',
            })}
          </Button>
        </div>
      </Popup>
    </Screen>
  );
};

export default ApplyBindAccount;
