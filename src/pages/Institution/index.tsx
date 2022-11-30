import { Swiper } from 'antd-mobile';
import { stringify } from 'query-string';
import { Link } from 'react-router-dom';
import { useHomeCropMe } from '../../api/endpoints/transformer';

import ic_default_head from '../../assets/ic_default_head.png';

const Institution = () => {
  const { data } = useHomeCropMe();
  return (
    <div className="h-screen bg-gray-100 min-h-0 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Swiper autoplay>
          {data?.data?.banner?.map((v) => (
            <Swiper.Item key={v.bannerId}>
              <div className="h-56">
                <img alt="" src={v.imageUrl} className="w-full h-full" />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>

        <div className="p-4 font-bold text-xl bg-white">
          <div>金牌機构排行榜</div>
        </div>

        {data?.data?.scoreRank?.map((v) => (
          <Link
            to={{ pathname: '/user-home', search: stringify({ userId: v.userId }) }}
            key={v.userId}
            className="flex flex-col p-4 bg-white mb-2"
          >
            <div className="flex items-center">
              <img alt="" src={v.headUrl ?? ic_default_head} className="w-10 h-10 rounded-full" />
              <div className="ml-2.5">
                <div className="text-base text-[#1d3155]">{v.userName}</div>
                <div className="text-xs text-gray-400">已入住{v.days}天</div>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div className="flex flex-col">
                <div className="text-xs text-gray-400">準確率</div>
                <div className=" text-lg text-[#1d3155] font-bold">{v.correctRate ?? '--'}%</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-400">總收益(USDT)</div>
                <div className=" text-lg text-[#1d3155] font-bold">{v.totalProfit ?? '--'}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-400">上月收益(USDT)</div>
                <div className=" text-lg text-[#1d3155] font-bold">{v.monthProfit ?? '--'}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Institution;
