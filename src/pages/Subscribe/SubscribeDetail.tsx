import { Input, Modal, ProgressBar, Skeleton, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
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
    },
  );

  const {
    data: getSubscribeDetail,
    isLoading,
    refetch,
  } = useGetSubscribeDetail(
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
    },
  );

  const detail = getSubscribeDetail?.data?.detail;

  const state = useSubscribeState();

  const currentState = state[detailState];

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

  const history = useHistory();

  if (isLoading) {
    return (
      <Screen headerTitle={intl.formatMessage({ defaultMessage: '新幣申購', id: 'I/5B/d' })}>
        <div className="p-8">
          <Skeleton style={{ height: 280 }} animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </div>
      </Screen>
    );
  }

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '新幣申購', id: 'I/5B/d' })}>
      <Container className="flex-1 overflow-y-auto">
        <div className="px-8">
          <div className="mt-4 flex">
            <div className="w-20 h-20 mr-4">
              <img alt="" src={detail?.image} className=" w-full h-auto object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex">
                <span className="text-[#333333] text-base flex-1">{detail?.symbol}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {intl.formatMessage({ defaultMessage: '基本資訊', id: 'ga4StX' })}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>{intl.formatMessage({ defaultMessage: '進度', id: 'fu1KIo' })}</span>
            <span>{intl.formatMessage({ defaultMessage: '活動總量', id: 'zMxwE3' })}</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <ProgressBar
              percent={Number(detail?.progress || 0)}
              style={{
                '--fill-color': currentState.color,
              }}
            />
            <div className="text-right mt-2">
              <span>{detail?.progress}%</span>
            </div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
            </div>
            <div className="mt-1">{currentState.label}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '活動總量', id: 'zMxwE3' })}
            </div>
            <div className="mt-1">{detail?.allSum}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '認購價格', id: '+8cZlc' })}
            </div>
            <div className="mt-1">{detail?.rate}USDT</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '活動幣種', id: 'T5DLIZ' })}
            </div>
            <div className="mt-1">{detail?.symbol}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '接受幣種', id: '8gjJxE' })}
            </div>
            <div className="mt-1">USDT</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '開始時間', id: 'zVPdxg' })}
            </div>
            <div className="mt-1">{stringDateFormat(detail?.startTime)}</div>
          </div>

          <div className=" mt-2 text-xs">
            <div className="text-[#999]">
              {intl.formatMessage({ defaultMessage: '結束時間', id: 'Otg9/k' })}
            </div>
            <div className="mt-1">{stringDateFormat(detail?.endTime)}</div>
          </div>

          <div className="my-8 flex justify-center">
            <a
              className="w-full h-10 px-4 flex items-center justify-center text-white rounded"
              style={{ backgroundColor: currentState.color }}
              onClick={() => {
                if (detailState === '1') {
                  setVisible(true);
                } else if (detailState === '2') {
                  history.push({
                    pathname: '/market2',
                    search: stringify({ isLever: 1, symbol: detail?.symbol }),
                  });
                }
              }}
            >
              {currentState.button}
            </a>
          </div>
        </div>
        <Modal
          visible={visible}
          title={intl.formatMessage({ defaultMessage: '提示', id: 'kCh5Jz' })}
          content={
            <div className="flex items-center text-sm bg-gray-100 rounded p-2">
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
                {intl.formatMessage({ defaultMessage: '全額申購', id: '12rpup' })}
              </a>
            </div>
          }
          actions={[
            {
              key: 'cancel',
              text: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
              onClick() {
                setCount('');
                setVisible(false);
              },
            },
            {
              key: 'confirm',
              text: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
              onClick() {
                if (detailState === '1') {
                  if (!count || !count.trim().length) {
                    Toast.show(
                      intl.formatMessage({ defaultMessage: '請輸入申購數量', id: '10mXat' }),
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
    font-size: 12px;
    --track-width: 6px;
    --track-color: #ececec;
    --fill-color: #5fce64;
  }
  .adm-modal-body:not(.adm-modal-with-image) {
    padding-top: 10px;
  }
  .adm-modal-title {
    text-align: left;
    font-size: 14px;
  }

  .adm-input-element {
    font-size: 12px;
    &::placeholder {
      color: #999;
    }
  }
`;

export default SubscribeDetail;
