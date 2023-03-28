import { List } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useIdentityGet } from '../../api/endpoints/transformer';
import defaultHead from '../../assets/ic_default_head.png';
import ic_home_mine_help from '../../assets/ic_home_mine_help.png';
import ic_home_mine_kefu from '../../assets/ic_home_mine_kefu.png';
import ic_home_mine_notice from '../../assets/ic_home_mine_notice.png';
import ic_home_mine_setting from '../../assets/ic_home_mine_setting.png';
import ic_home_mine_shiming from '../../assets/ic_home_mine_shiming.png';
import ic_home_mine_stock from '../../assets/ic_home_mine_stock.png';
import ic_home_mine_youxiang from '../../assets/ic_home_mine_youxiang.png';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import ic_svg_edit from '../../assets/ic_svg_edit.svg';
import ic_svg_recharge_coin from '../../assets/ic_svg_recharge_coin.svg';
import ic_svg_take_coin from '../../assets/ic_svg_take_coin.svg';
import { useChatLink } from '../../hooks/useChatLink';
import { useAuthStore } from '../../stores/auth';

const My = () => {
  const history = useHistory();

  const { userInfo } = useAuthStore();

  const { data: identityGet } = useIdentityGet();

  const intl = useIntl();

  const chatLink = useChatLink();

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
            <span>{intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}</span>
          </Link>
          <Link className="flex-1 flex flex-col items-center" to="/take-coin">
            <div className="bg-[#f0f1f5] w-12 h-12 mb-2 rounded-lg">
              <img alt="" src={ic_svg_take_coin} />
            </div>
            <span>{intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}</span>
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
          {intl.formatMessage({ defaultMessage: '交易記錄', id: 'b6Krbb' })}
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
          {intl.formatMessage({ defaultMessage: '系統通知', id: 'DobpJi' })}
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_help} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/help-center');
          }}
        >
          {intl.formatMessage({ defaultMessage: '幫助中心', id: 'BRtAE8' })}
        </List.Item>
      </List>

      <List>
        <List.Item
          prefix={<img alt="" src={ic_home_mine_kefu} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            // history.push('/chat');
            window.open(chatLink);
          }}
        >
          {intl.formatMessage({ defaultMessage: '客服', id: '2lQGkw' })}
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_setting} className="w-8 h-8" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/settings');
          }}
        >
          {intl.formatMessage({ defaultMessage: '設置', id: '+eQ50+' })}
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
          {intl.formatMessage({ defaultMessage: '實名認證', id: 'vgGksF' })}
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
          {intl.formatMessage({ defaultMessage: '綁定郵箱', id: '+PkU4R' })}
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
