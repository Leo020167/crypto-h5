import { NavBar, Swiper } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { useHomeCropMe } from '../../api/endpoints/transformer';

import ic_default_head from '../../assets/ic_default_head.png';

const Institution = () => {
  const { data } = useHomeCropMe();
  const intl = useIntl();
  const history = useHistory();
  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-100">
      <NavBar onBack={() => history.goBack()} className="bg-white">
        {intl.formatMessage({ defaultMessage: '金牌機构排行榜', id: 'NH0fE1' })}
      </NavBar>
      <div className="flex-1 overflow-y-auto">
        <Swiper autoplay>
          {data?.data?.banner?.map((v) => (
            <Swiper.Item key={v.bannerId}>
              <div className="h-56">
                <img alt="" src={v.imageUrl} className="h-full w-full" />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>

        {data?.data?.scoreRank?.map((v) => (
          <Link
            to={{ pathname: '/user-home', search: stringify({ userId: v.userId }) }}
            key={v.userId}
            className="mb-2 flex flex-col bg-white p-4"
          >
            <div className="flex items-center">
              <img alt="" src={v.headUrl ?? ic_default_head} className="h-10 w-10 rounded-full" />
              <div className="ml-2.5">
                <div className="text-base text-[#1d3155]">{v.userName}</div>
                <div className="text-xs text-gray-400">
                  {intl.formatMessage(
                    { defaultMessage: '已入住{days}天', id: 'JYhyDW' },
                    { days: v.days },
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <div className="flex flex-col">
                <div className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '準確率', id: 'jPTst4' })}
                </div>
                <div className=" text-lg font-bold text-[#1d3155]">{v.correctRate ?? '--'}%</div>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <div className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '總收益(USDT)', id: 'GSpULh' })}
                </div>
                <div className=" text-lg font-bold text-[#1d3155]">{v.totalProfit ?? '--'}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-400">
                  {intl.formatMessage({ defaultMessage: '上月收益(USDT)', id: 'UVGoM9' })}
                </div>
                <div className=" text-lg font-bold text-[#1d3155]">{v.monthProfit ?? '--'}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Institution;
