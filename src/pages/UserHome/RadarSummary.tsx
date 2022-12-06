import { useIntl } from 'react-intl';
import { useQueryParam, StringParam } from 'use-query-params';
import { usePersonalHome } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import TradableTargetChart from './TradableTargetChart';

const RadarSummary = () => {
  const [userId] = useQueryParam('userId', StringParam);

  const { data } = usePersonalHome(
    { targetUid: userId ?? '' },
    {
      query: {
        enabled: !!userId,
      },
    },
  );

  const radar = data?.data?.userRadar;

  const intl = useIntl();

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '雷達圖説明', id: 'usmupP' })}>
      <div className="flex-1 overflow-y-auto p-4">
        <TradableTargetChart radar={radar} />

        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            {intl.formatMessage({ defaultMessage: '跟單盈利額', id: 'bi/Yk/' })}(
            {radar?.radarFollowBalance})
          </div>
          <div className="text-gray-400 mt-1">
            {intl.formatMessage({
              defaultMessage: '解釋：跟隨高手的用戶最近30天盈虧總金額。',
              id: 'Wrputc',
            })}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            {intl.formatMessage({
              defaultMessage: '盈利能力',
              id: 'hJ1meP',
            })}
            ({radar?.radarProfitRate}%)
          </div>
          <div className="text-gray-400 mt-1">
            {intl.formatMessage({
              defaultMessage:
                '解釋：高高手最近30天平均每筆交易的收益率。數值越大，代表個人盈利能力越強。',
              id: 'Sz8zFH',
            })}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            {intl.formatMessage({
              defaultMessage: '跟單收益率',
              id: '6Dthl9',
            })}
            ({radar?.radarFollowProfitRate}%)
          </div>
          <div className="text-gray-400 mt-1">
            {intl.formatMessage({
              defaultMessage:
                '解釋：跟隨高手的用戶最近30天平均每筆交易的收益率。數值越大，代表跟隨高手的用戶收益越好。',
              id: 'H+7dPx',
            })}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            {intl.formatMessage({
              defaultMessage: '跟單勝率',
              id: 'AlC2M4',
            })}
            ({radar?.radarFollowWinRate}%)
          </div>
          <div className="text-gray-400 mt-1">
            {intl.formatMessage({
              defaultMessage: '解釋：跟隨高手盈利的幾率。數值越大，代表跟單獲利的可能性就越高。',
              id: 'RDdf7n',
            })}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            {intl.formatMessage({
              defaultMessage: '人氣指數',
              id: 'G0ISee',
            })}
            ({radar?.radarFollowNum})
          </div>
          <div className="text-gray-400 mt-1">
            {intl.formatMessage({
              defaultMessage: '解釋：高手最近30天跟單人數，數值越大，代表跟隨者越多，人氣越高。',
              id: '4Qsef4',
            })}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default RadarSummary;
