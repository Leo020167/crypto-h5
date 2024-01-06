import { List } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
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

  const { userInfo, getUserInfo } = useAuthStore();

  const intl = useIntl();

  const chatLink = useChatLink();
  const { data: identityGet } = useIdentityGet({});

  useInterval(() => {
    getUserInfo();
  }, 2000);

  return (
    <Container className="my-list h-full overflow-y-auto bg-[#F0F1F7] dark:bg-[#161720]">
      <div className="bg-white pt-4 dark:bg-[#2A2E38]">
        <div className="px-4 py-2">
          <div className="avatar flex">
            <div className="mr-4 h-10 w-10 overflow-hidden rounded-full">
              <img alt="head" src={userInfo?.headUrl ?? defaultHead} />
            </div>
            <div>
              <div
                className="mb-2 flex text-xl font-bold leading-5 text-[#c1d3155]"
                onClick={() => history.push('/personal')}
              >
                <span>{userInfo?.userName}</span>
                <img alt="" src={ic_svg_edit} className="ml-2 w-5" />
              </div>
              <span className="text-[#a2abc8] dark:text-[#999999]">
                <div>ID: {userInfo?.userId}</div>
                <div>
                  {intl.formatMessage({ defaultMessage: '信誉分: ', id: '6f0YHY' })}
                  {userInfo?.score}
                </div>
              </span>
            </div>
          </div>
        </div>

        <div className="mb-2 flex justify-between bg-white py-2 dark:bg-[#2A2E38]">
          <Link className="flex flex-1 flex-col items-center" to="/recharge-coin">
            <div className="mb-2 h-12 w-12 rounded-lg bg-[#f0f1f5]">
              <img alt="" src={ic_svg_recharge_coin} />
            </div>
            <span>{intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center" to="/take-coin">
            <div className="mb-2 h-12 w-12 rounded-lg bg-[#f0f1f5]">
              <img alt="" src={ic_svg_take_coin} />
            </div>
            <span>{intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}</span>
          </Link>
        </div>
      </div>

      <List className="mb-2">
        <List.Item
          prefix={<img alt="" src={ic_home_mine_stock} className="h-6 w-6" />}
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
          prefix={<img alt="" src={ic_home_mine_notice} className="h-6 w-6" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/notifications');
          }}
        >
          {intl.formatMessage({ defaultMessage: '系統通知', id: 'DobpJi' })}
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_help} className="h-6 w-6" />}
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
          prefix={<img alt="" src={ic_home_mine_kefu} className="h-6 w-6" />}
          arrow={<Arrow />}
          onClick={() => {
            // history.push('/chat');
            window.open(chatLink);
          }}
        >
          {intl.formatMessage({ defaultMessage: '客服', id: '2lQGkw' })}
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_setting} className="h-6 w-6" />}
          arrow={<Arrow />}
          onClick={() => {
            history.push('/settings');
          }}
        >
          {intl.formatMessage({ defaultMessage: '設置', id: '+eQ50+' })}
        </List.Item>

        <List.Item
          prefix={<img alt="" src={ic_home_mine_shiming} className="h-6 w-6" />}
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
          prefix={<img alt="" src={ic_home_mine_youxiang} className="h-6 w-6" />}
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
    padding: 1rem 0;
    color: #1d3155;
    font-size: 0.875rem;
  }

  .adm-list-item-content-arrow {
    color: #aaaaaa;
  }

  .adm-list-item {
    background-color: #2a2e38;
  }
`;

export default My;
