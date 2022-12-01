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

  return (
    <Screen headerTitle="雷達圖説明">
      <div className="flex-1 overflow-y-auto p-4">
        <TradableTargetChart radar={radar} />

        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            跟單盈利額({radar?.radarFollowBalance})
          </div>
          <div className="text-gray-400 mt-1">解釋：跟隨高手的用戶最近30天盈虧總金額。</div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            盈利能力({radar?.radarProfitRate}%)
          </div>
          <div className="text-gray-400 mt-1">
            解釋：高高手最近30天平均每筆交易的收益率。數值越大，代表個人盈利能力越強。
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            跟單收益率({radar?.radarFollowProfitRate}%)
          </div>
          <div className="text-gray-400 mt-1">
            解釋：跟隨高手的用戶最近30天平均每筆交易的收益率。數值越大，代表跟隨高手的用戶收益越好。
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">
            跟單勝率({radar?.radarFollowWinRate}%)
          </div>
          <div className="text-gray-400 mt-1">
            解釋：跟隨高手盈利的幾率。數值越大，代表跟單獲利的可能性就越高。
          </div>
        </div>
        <div className="mt-5">
          <div className="text-sm font-bold text-[#1d3155]">人氣指數({radar?.radarFollowNum})</div>
          <div className="text-gray-400 mt-1">
            解釋：高手最近30天跟單人數，數值越大，代表跟隨者越多，人氣越高。
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default RadarSummary;
