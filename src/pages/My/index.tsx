import { Badge, List } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { useGetUnreadCount, useIdentityGet } from '../../api/endpoints/transformer';
import defaultHead from '../../assets/ic_default_head.png';
import ic_home_mine_help from '../../assets/ic_home_mine_help.png';
import ic_home_mine_kefu from '../../assets/ic_home_mine_kefu.png';
import ic_home_mine_setting from '../../assets/ic_home_mine_kefu.png';
import ic_home_mine_notice from '../../assets/ic_home_mine_notice.png';
import ic_home_mine_shiming from '../../assets/ic_home_mine_shiming.png';
import ic_home_mine_stock from '../../assets/ic_home_mine_stock.png';
import ic_home_mine_youxiang from '../../assets/ic_home_mine_youxiang.png';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import ic_svg_edit from '../../assets/ic_svg_edit.svg';
import ic_svg_legal_coin from '../../assets/ic_svg_legal_coin.svg';
import ic_svg_recharge_coin from '../../assets/ic_svg_recharge_coin.svg';
import ic_svg_take_coin from '../../assets/ic_svg_take_coin.svg';
import ic_svg_transfer_coin from '../../assets/ic_svg_transfer_coin.svg';
import { useAuthStore } from '../../stores/auth';

import { getHomeMy } from '../../utils/api';

const My = () => {
  const history = useHistory();

  const { userInfo } = useAuthStore();

  const [helpCenterUrl, setHelpCenterUrl] = useState<string>('');

  const { data: identityGet } = useIdentityGet();

  useMount(() => {
    getHomeMy().then((res) => {
      if (res.code === '200') {
        setHelpCenterUrl(res.data.helpCenterUrl);
      }
    });
  });

  const { data } = useGetUnreadCount();

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <div className="bg-white pt-4">
        <div className="px-4 py-2">
          <div className="avatar flex">
            <div className="w-10 h-10 rounded-full mr-4 overflow-hidden">
              <img alt="head" src={userInfo?.headUrl ?? defaultHead} />
            </div>
            <div>
              <div
                className="font-bold text-xl leading-5 text-[#c1d3155] flex mb-2"
                onClick={() => history.push('personal')}
              >
                <span>{userInfo?.userName}</span>
                <img alt="" src={ic_svg_edit} className="ml-2 w-5" />
              </div>
              <span className="text-[#a2abc8]">ID: {userInfo?.userId}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between bg-white mb-2 py-2">
          <Link className="flex-1 flex flex-col items-center" to="/recharge-coin">
            <div className="bg-[#f0f1f5] w-12 h-12 mb-2 rounded-lg">
              <img alt="" src={ic_svg_recharge_coin} />
            </div>
            <span>充币</span>
          </Link>
          <Link className="flex-1 flex flex-col items-center" to="/take-coin">
            <div className="bg-[#f0f1f5] w-12 h-12 mb-2 rounded-lg">
              <img alt="" src={ic_svg_take_coin} />
            </div>
            <span>提币</span>
          </Link>
          <Link className="flex-1 flex flex-col items-center" to="/transfer-coin">
            <div className="bg-[#f0f1f5] w-12 h-12 mb-2 rounded-lg">
              <img alt="" src={ic_svg_transfer_coin} />
            </div>
            <span>划转</span>
          </Link>

          <Link className="flex-1 flex flex-col items-center" to="/legal-money">
            <Badge content={Number(data?.data?.otcCount) || null}>
              <div className="bg-[#f0f1f5] w-12 h-12 mb-2 rounded-lg">
                <img alt="" src={ic_svg_legal_coin} />
              </div>
              <span>法币买卖</span>
            </Badge>
          </Link>
        </div>
      </div>

      <List className="mb-2">
        <List.Item
          prefix={<img alt="" src={ic_home_mine_stock} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/transaction-records');
          }}
        >
          交易记录
        </List.Item>
      </List>

      <List className="mb-2">
        <List.Item
          prefix={<img alt="" src={ic_home_mine_notice} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/notifications');
          }}
        >
          系统通知
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_help} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            if (helpCenterUrl) {
              window.open(helpCenterUrl);
            }
          }}
        >
          帮助中心
        </List.Item>
      </List>

      <List>
        <List.Item
          prefix={<img alt="" src={ic_home_mine_kefu} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/chat');
          }}
        >
          客服
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_setting} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/settings');
          }}
        >
          设置
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_shiming} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            if (identityGet?.data?.identityAuth?.state === '1') {
              history.push('/verified-result');
            } else {
              history.push('/verified');
            }
          }}
        >
          实名认证
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_youxiang} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            if (userInfo?.email) {
              history.push(`/email-auth?${stringify({ mode: 1 })}`);
            } else {
              history.push('/bind-email');
            }
          }}
        >
          绑定邮箱
        </List.Item>
      </List>
    </Container>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 1.5rem;
  }

  .adm-list-item-content-main {
    color: #1d3155;
    font-size: 0.875rem;
    padding: 1rem 0;
  }

  .adm-list-item-content-arrow {
    color: #aaaaaa;
  }
`;

export default My;
