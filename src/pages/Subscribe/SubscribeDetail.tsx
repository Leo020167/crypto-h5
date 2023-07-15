import { Input, Modal, ProgressBar, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import {
  useAllInSubscribe,
  useApplySubscribe,
  useGetSubscribeDetail,
} from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';
import { useSubscribeState } from './useSubscribeState';

const SubscribeDetail = () => {
  const [id] = useQueryParam('id', StringParam);
  const intl = useIntl();

  const [detailState, setDetailState] = useState('0');

  const [visible, setVisible] = useState(false);

  const { data } = useAllInSubscribe(
    { subscribeId: id ?? '' },
    {
      query: { enabled: !!id },
    }
  );

  const { data: getSubscribeDetail, refetch } = useGetSubscribeDetail(
    { id: id ?? '' },
    {
      query: {
        enabled: !!id,
        onSuccess(data) {
          if (data.code === '200') {
            setDetailState(data.data?.detail?.state ?? '0');
          }
        },
      },
    }
  );

  const detail = getSubscribeDetail?.data?.detail;

  const state = useSubscribeState();

  const currentState = state[detailState];

  const percent = useMemo(() => {
    let p = 0;
    const a = Number(detail?.alCount ?? 0);
    const b = Number(detail?.sum ?? 0);

    if (b) {
      p = a / b;
    }

    return Math.round(p * 100);
  }, [detail?.alCount, detail?.sum]);

  const [count, setCount] = useState('');

  const applySubscribe = useApplySubscribe({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setCount('');
          setVisible(false);
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  return (
    <Screen
      headerTitle={intl.formatMessage({
        defaultMessage: '新幣申購',
        id: 'I/5B/d',
      })}
    >
      <Container className="flex-1 overflow-y-auto">
        <div className="px-8">
          <div className="mt-4 flex">
            <div className="mr-4 h-20 w-20">
              <img alt="" src="" className=" h-auto w-full" />
            </div>
            <div className="flex-1">
              <div className="flex">
                <span className="flex-1 text-base text-[#333333]">--</span>
                <span
                  className="rounded px-2  py-1 text-xs text-white"
                  style={{ backgroundColor: currentState.color }}
                >
                  {currentState.label}
                </span>
              </div>
              {!!detail?.content && (
                <div
                  className="mt-4"
                  dangerouslySetInnerHTML={{ __html: detail.content }}
                ></div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <a
              className=" mt-8 flex h-9 w-44 items-center justify-center rounded px-4 text-white"
              style={{ backgroundColor: currentState.color }}
              onClick={() => {
                if (detailState === '1') {
                  setVisible(true);
                }
              }}
            >
              {currentState.button}
            </a>
          </div>

          <div className="mt-8">
            {intl.formatMessage({ defaultMessage: '基本資訊', id: 'ga4StX' })}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>
              {intl.formatMessage({ defaultMessage: '進度', id: 'fu1KIo' })}
            </span>
            <span>
              {intl.formatMessage({
                defaultMessage: '本輪剩餘申購量',
                id: 's2XXAu',
              })}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <ProgressBar
              percent={percent}
              style={{
                '--fill-color': currentState.color,
              }}
            />
            <div className="mt-2 text-right">
              <span>{percent}%</span>
            </div>
          </div>

          <div className=" mt-6 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '本輪可申購總量',
                id: 'TPc2/L',
              })}
            </div>
            <div className="mt-1">{detail?.sum}</div>
          </div>

          <div className=" mt-6 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '單次申購範圍',
                id: 'JoxLL6',
              })}
            </div>
            <div className="mt-1">{[detail?.min, detail?.max].join('~')}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '本輪已申購',
                id: 'Sj3tff',
              })}
            </div>
            <div className="mt-1">{detail?.alCount}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '本輪剩餘申購量',
                id: 's2XXAu',
              })}
            </div>
            <div className="mt-1">
              {Number(detail?.sum ?? 0) - Number(detail?.alCount ?? 0)}
            </div>
          </div>

          {detailState === '0' && (
            <div className=" mt-2 text-xs">
              <div className="text-[#999]">
                {intl.formatMessage({
                  defaultMessage: '距離本輪申購開始還剩',
                  id: 'KshKCt',
                })}
              </div>
              <div className="mt-1">
                {!!detail?.startTime && (
                  <Countdown
                    date={new Date(Number(detail.startTime ?? 0) * 1000)}
                    daysInHours
                    onComplete={() => {
                      setDetailState('2');
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {detailState === '1' && (
            <div className=" mt-2 text-xs">
              <div className="text-[#999]">
                {intl.formatMessage({
                  defaultMessage: '距離本輪申購結束還剩',
                  id: 'ikrDph',
                })}
              </div>
              <div className="mt-1">
                {!!detail?.endTime && (
                  <Countdown
                    date={new Date(Number(detail.endTime ?? 0) * 1000)}
                    daysInHours
                    onComplete={() => {
                      setDetailState('2');
                    }}
                  />
                )}
              </div>
            </div>
          )}

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '申購總量', id: 'Wmlj/H' })}
            </div>
            <div className="mt-1">{detail?.allSum}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '本輪開始申購時間',
                id: 'waMjSH',
              })}
            </div>
            <div className="mt-1">
              {stringDateFormat(detail?.startTime)}
              {intl.formatMessage({
                defaultMessage: '（香港時間）',
                id: 'WTYv3l',
              })}
            </div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '本輪結束申購時間',
                id: 'eBTG87',
              })}
            </div>
            <div className="mt-1">
              {stringDateFormat(detail?.endTime)}
              {intl.formatMessage({
                defaultMessage: '（香港時間）',
                id: 'WTYv3l',
              })}
            </div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '上市交易時間',
                id: 'zS9FwU',
              })}
            </div>
            <div className="mt-1">
              {stringDateFormat(detail?.tradeTime)}
              {intl.formatMessage({
                defaultMessage: '（香港時間）',
                id: 'WTYv3l',
              })}
            </div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '上市解倉時間',
                id: 'UQ2ett',
              })}
            </div>
            <div className="mt-1">
              {stringDateFormat(detail?.liftBanTime)}
              {intl.formatMessage({
                defaultMessage: '（香港時間）',
                id: 'WTYv3l',
              })}
            </div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '申購價格', id: 'QKyNXd' })}
            </div>
            <div className="mt-1">{detail?.rate}USDT</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '我已申購', id: 'MxAApV' })}
            </div>
            <div className="mt-1">{detail?.userCount}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({
                defaultMessage: '最小申購量',
                id: 'lKbaKq',
              })}
            </div>
            <div className="mt-1">{detail?.min}</div>
          </div>

          <div className=" mt-10 text-xs">
            <div className="text-base">
              {intl.formatMessage({ defaultMessage: '發起成員', id: 'rEYIpu' })}
            </div>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: detail?.authorSummary ?? '' }}
            ></div>
          </div>

          <div className=" mt-4 text-xs">
            <div className="text-base">
              {intl.formatMessage({ defaultMessage: '項目介紹', id: 'T8RXyP' })}
            </div>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: detail?.summary ?? '' }}
            ></div>
          </div>

          <div className=" mt-4 text-xs">
            <div className="text-base">
              {intl.formatMessage({ defaultMessage: '幣種介紹', id: 'bBKCBS' })}
            </div>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: detail?.content ?? '' }}
            ></div>
          </div>

          <div className=" mt-4 text-xs">
            <div className="text-base">
              {intl.formatMessage({
                defaultMessage: '項目參與條件',
                id: 'DQq3pD',
              })}
            </div>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: detail?.condition ?? '' }}
            ></div>
          </div>

          <div className=" mt-4 text-xs">
            <div className="text-base">
              {intl.formatMessage({ defaultMessage: '風險提示', id: 'zxYcWZ' })}
            </div>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: detail?.warning ?? '' }}
            ></div>
          </div>

          <div className=" mb-5 mt-4 text-xs">
            <div className="text-base">
              {intl.formatMessage({ defaultMessage: '申購說明', id: 'Pcqs8N' })}
            </div>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: detail?.description ?? '' }}
            ></div>
          </div>
        </div>
        <Modal
          visible={visible}
          title={intl.formatMessage({ defaultMessage: '提示', id: 'kCh5Jz' })}
          content={
            <div className="flex items-center rounded bg-gray-100 p-2 text-sm">
              <Input
                value={count}
                onChange={setCount}
                min={0}
                type="number"
                maxLength={18}
                className="flex-1"
                placeholder={intl.formatMessage({
                  defaultMessage: '請輸入申購數量',
                  id: '10mXat',
                })}
              />
              <a
                className="text-xs text-[#6175ae]"
                onClick={() => {
                  setCount(data?.data?.maxCount ?? '0');
                }}
              >
                {intl.formatMessage({
                  defaultMessage: '全額申購',
                  id: '12rpup',
                })}
              </a>
            </div>
          }
          actions={[
            {
              key: 'cancel',
              text: intl.formatMessage({
                defaultMessage: '取消',
                id: '2QzYmY',
              }),
              onClick() {
                setCount('');
                setVisible(false);
              },
            },
            {
              key: 'confirm',
              text: intl.formatMessage({
                defaultMessage: '確定',
                id: 'ofc1Jv',
              }),
              onClick() {
                if (detailState === '1') {
                  if (!count || !count.trim().length) {
                    Toast.show(
                      intl.formatMessage({
                        defaultMessage: '請輸入申購數量',
                        id: '10mXat',
                      })
                    );
                    return;
                  }

                  const _count = Number(count);
                  const _min = Number(detail?.min || 0);
                  const _max = Number(detail?.max || 0);

                  if (_count < _min || _count > _max) {
                    Toast.show(
                      intl.formatMessage(
                        {
                          defaultMessage: '請輸入正確申購範圍 {range}',
                          id: '5S7UlH',
                        },
                        {
                          range: `${_min}~${_max}`,
                        }
                      )
                    );
                    return;
                  }

                  applySubscribe.mutate({
                    data: {
                      subscribeId: id ?? '',
                      count,
                    },
                  });
                }
              },
            },
          ]}
        />
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-progress-bar {
    --track-width: 6px;
    --track-color: #ececec;
    --fill-color: #5fce64;
    font-size: 12px;
  }
  .adm-modal-body:not(.adm-modal-with-image) {
    padding-top: 10px;
  }
  .adm-modal-title {
    font-size: 14px;
    text-align: left;
  }

  .adm-input-element {
    font-size: 12px;
    &::placeholder {
      color: #999;
    }
  }
`;

export default SubscribeDetail;
