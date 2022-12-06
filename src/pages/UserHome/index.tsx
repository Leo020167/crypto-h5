import { Button, Dialog, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAttentionAdd, usePersonalHome, useUnBindFollow } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';

import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
import { stringDateFormat } from '../../utils/date';
import Capability from './Capability';
import TradableTargetChart from './TradableTargetChart';

const UserHome = () => {
  const [userId] = useQueryParam('userId', StringParam);

  const { data, refetch } = usePersonalHome(
    { targetUid: userId ?? '' },
    {
      query: {
        enabled: !!userId,
      },
    },
  );

  const radar = data?.data?.userRadar;

  const { userInfo } = useAuthStore();

  const history = useHistory();

  const attentionAdd = useAttentionAdd({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  const unBindFollow = useUnBindFollow({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          refetch();
          Toast.show(data.msg);
        }
      },
    },
  });

  const intl = useIntl();

  const buttons = useMemo(() => {
    if (radar?.userId === userInfo?.userId) return null;

    const renderFollowLabel = () => {
      if (radar?.myIsAttention === '0') {
        if (radar?.subIsFee === '0') {
          return intl.formatMessage({ defaultMessage: '免費訂閱', id: 'J5FSqv' });
        }
        return intl.formatMessage({ defaultMessage: '訂閱', id: 'gx0XBL' });
      } else {
        if (radar?.subIsFee === '0') {
          return intl.formatMessage({ defaultMessage: '已訂閱', id: 'A8sxJT' });
        } else {
          return intl.formatMessage({ defaultMessage: '續費', id: 'twArjt' });
        }
      }
    };

    const renderTime = () => {
      if (radar?.myIsAttention !== '0' && radar?.subIsFee !== '0') {
        if (radar?.isExpireTime === '1' && Number(radar?.expireTime) > 0) {
          return (
            <div style={{ color: 'red' }}>
              {intl.formatMessage({ defaultMessage: '訂閱已過期', id: 'THckAT' })}
            </div>
          );
        } else if (radar?.isExpireTime === '0' && Number(radar?.expireTime) > 0) {
          return (
            <div style={{ color: '#1d3155' }}>
              {intl.formatMessage({ defaultMessage: '到期:', id: 'QWavza' })}
              {stringDateFormat(radar?.expireTime, 'YYYY-MM-DD')}
            </div>
          );
        }
      }
      return null;
    };

    return (
      <div className="flex pb-5 px-5 w-full gap-5">
        <div className="flex-1">
          <Button
            color="primary"
            block
            onClick={() => {
              if (userInfo) {
                if (!radar) return;

                if (radar.subIsFee === '0') {
                  if (radar.myIsAttention === '0') {
                    Dialog.confirm({
                      title: intl.formatMessage({ defaultMessage: '提示', id: 'kCh5Jz' }),
                      content: intl.formatMessage({
                        defaultMessage: '是否訂閲該用戶？',
                        id: '2+1H1y',
                      }),
                      confirmText: intl.formatMessage({
                        defaultMessage: '訂閲',
                        id: 'zv2r2Q',
                      }),
                      onConfirm() {
                        attentionAdd.mutate({
                          data: {
                            attentionUid: radar.userId ?? '',
                            num: '0',
                          },
                        });
                      },
                    });
                  } else {
                    Toast.show(
                      intl.formatMessage({
                        defaultMessage: '已訂閱',
                        id: 'A8sxJT',
                      }),
                    );
                  }
                } else {
                  // TODO show attention dialog
                }
              } else {
                history.push('/login');
              }
            }}
          >
            {renderFollowLabel()}
          </Button>
          {renderTime()}
        </div>

        <div className="flex-1">
          <Button
            color="primary"
            block
            onClick={() => {
              if (!radar) return;
              if (radar.myIsFollow === '1') {
                unBindFollow.mutate({
                  data: {
                    dvUid: radar.userId ?? '',
                  },
                });
              } else {
                if (radar) {
                  history.push({
                    pathname: '/apply-bind-account',
                    search: stringify({ userId: radar.userId }),
                  });
                }
              }
            }}
          >
            {radar?.myIsFollow === '1'
              ? intl.formatMessage({
                  defaultMessage: '已綁定',
                  id: 'qZzRwu',
                })
              : intl.formatMessage({
                  defaultMessage: '申請綁定',
                  id: 'G5BgHI',
                })}
          </Button>
        </div>
      </div>
    );
  }, [radar, userInfo, intl, attentionAdd, history, unBindFollow]);

  return (
    <Screen>
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="pt-5 flex flex-col items-center justify-center bg-white">
          <img alt="" src={radar?.headUrl ?? ic_default_head} className="w-11 h-11 rounded-full" />
          <div className="mt-1 text-2xl font-bold text-[#1d3155]">{radar?.userName}</div>
          <div className="text-gray-400">
            <span>ID: {radar?.userId}</span>
            <span className="ml-5">
              {intl.formatMessage(
                {
                  defaultMessage: '已入駐{days}天',
                  id: 'bOeVuL',
                },
                { days: radar?.days },
              )}
            </span>
          </div>

          <div className="flex text-gray-400 mt-2 mb-5">
            <div className="flex flex-col items-center justify-center">
              <div className="text-[#1d3155] text-xl font-bold">{radar?.attentionNum ?? '--'}</div>
              <div className="text-gray-400 text-xs">
                {intl.formatMessage({
                  defaultMessage: '訂閱數',
                  id: '+prpsi',
                })}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center ml-6">
              <div className="text-[#1d3155] text-xl font-bold">
                {radar?.radarFollowNum ?? '--'}
              </div>
              <div className="text-gray-400 text-xs">
                {intl.formatMessage({
                  defaultMessage: '跟單人數',
                  id: 'q+hue1',
                })}
              </div>
            </div>
          </div>

          {buttons}
        </div>

        <div className="mt-4 px-5 bg-white flex flex-col">
          <div className="text-[#1d3155] my-2.5">
            {intl.formatMessage({
              defaultMessage: '交易收益',
              id: '4Oh5kb',
            })}
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <div className="text-xs text-gray-400">
                {intl.formatMessage({
                  defaultMessage: '準確率',
                  id: 'jPTst4',
                })}
              </div>
              <div className="text-lg text-[#1d3155]">{radar?.correctRate ?? '--'}%</div>
            </div>
            <div className="flex flex-col flex-1 items-center">
              <div className="text-xs text-gray-400">
                {intl.formatMessage({
                  defaultMessage: '總收益(USDT)',
                  id: 'GSpULh',
                })}
              </div>
              <div className="text-lg text-[#1d3155]">{radar?.totalProfit ?? '--'}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400">
                {intl.formatMessage({
                  defaultMessage: '上月收益(USDT)',
                  id: 'UVGoM9',
                })}
              </div>
              <div className="text-lg text-[#1d3155]">{radar?.monthProfit ?? '--'}</div>
            </div>
          </div>

          <div className="text-[#1d3155] mt-2.5">
            {intl.formatMessage({
              defaultMessage: '可交易標的',
              id: 'E5sgW+',
            })}
          </div>
          <div className="text-xs text-gray-400 mt-1">{radar?.describes}</div>

          <div className="my-4 relative">
            <TradableTargetChart radar={radar} />
            <Link
              to={{ pathname: '/radar-summary', search: stringify({ userId }) }}
              className="absolute right-2 bottom-2 text-xs text-[#fb875a] z-10"
            >
              {intl.formatMessage({
                defaultMessage: '詳情',
                id: '6EjbHU',
              })}{' '}
              &gt;
            </Link>
          </div>
        </div>

        <Capability radar={radar} />

        {!!radar?.recommend && (
          <div className="mt-5 mb-12 px-4 text-sm text-[#3d3a50]">{radar?.recommend}</div>
        )}
      </div>
    </Screen>
  );
};

export default UserHome;
