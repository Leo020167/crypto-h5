import { TabBar } from 'antd-mobile';
import { ReactNode, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import styled from 'styled-components';
import { ReactComponent as HomeTabAccountSvg } from '../assets/home_tab_account.svg';
import { ReactComponent as HomeTabAccountActiveSvg } from '../assets/home_tab_account_active.svg';
import { ReactComponent as HomeTabSvg } from '../assets/home_tab_cropyme.svg';
import { ReactComponent as HomeTabActiveSvg } from '../assets/home_tab_cropyme_active.svg';
import { ReactComponent as HomeTabFollowSvg } from '../assets/home_tab_follow.svg';
import { ReactComponent as HomeTabFollowActiveSvg } from '../assets/home_tab_follow_active.svg';
import { ReactComponent as HomeTabMarkSvg } from '../assets/home_tab_mark.svg';
import { ReactComponent as HomeTabMarkActiveSvg } from '../assets/home_tab_mark_active.svg';
import { ReactComponent as HomeTabMineSvg } from '../assets/home_tab_mine.svg';
import { ReactComponent as HomeTabMineActiveSvg } from '../assets/home_tab_mine_active.svg';

type TabLayoutProps = {
  children?: ReactNode;
};

export const TabLayout = ({ children }: TabLayoutProps) => {
  const location = useLocation();
  const history = useHistory();

  const intl = useIntl();

  const tabs = useMemo(
    () => [
      {
        key: '/home',
        title: intl.formatMessage({ defaultMessage: '首頁', id: 'bsSd3V' }),
        icon: <HomeTabSvg className="h-6" />,
        activeIcon: <HomeTabActiveSvg className="h-6" />,
      },
      {
        key: '/home/market',
        title: intl.formatMessage({ defaultMessage: '市場', id: 'COcMDt' }),
        icon: <HomeTabMarkSvg className="h-6" />,
        activeIcon: <HomeTabMarkActiveSvg className="h-6" />,
      },
      {
        key: '/home/account',
        title: intl.formatMessage({ defaultMessage: '資產', id: 'avV2Zh' }),
        icon: <HomeTabAccountSvg className="h-6" />,
        activeIcon: <HomeTabAccountActiveSvg className="h-6" />,
      },
      {
        key: '/trade-lever2',
        title: intl.formatMessage({ defaultMessage: '交易', id: '/ErIar' }),
        icon: <HomeTabFollowSvg className="h-6" />,
        activeIcon: <HomeTabFollowActiveSvg className="h-6" />,
      },
      {
        key: '/home/my',
        title: intl.formatMessage({ defaultMessage: '我的', id: '/I+pby' }),
        icon: <HomeTabMineSvg className="h-6" />,
        activeIcon: <HomeTabMineActiveSvg className="h-6" />,
      },
    ],
    [intl],
  );
  return (
    <Container className="flex h-screen flex-col">
      <div className="flex min-h-0 flex-1 flex-col pb-[85px]">{children}</div>
      <TabBar
        activeKey={location.pathname}
        onChange={(key) => {
          if (key === '/trade-lever2') {
            history.push('/trade-lever2?buySell=1&symbol=BTC');
          } else {
            history.push(key);
          }
        }}
        className="fixed bottom-0 left-0 right-0 z-10 bg-white py-2"
      >
        {tabs.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={(active) => (active ? item.activeIcon : item.icon)}
            title={item.title}
          />
        ))}
      </TabBar>
    </Container>
  );
};

const Container = styled.div`
  .adm-tab-bar {
    border-top: 1px solid #eeeeee;
    .adm-tab-bar-item-title {
      color: #bbbbbb;
      font-size: 12px;
      line-height: 16px;
      font-weight: bold;
    }

    .adm-tab-bar-item-active {
      .adm-tab-bar-item-title {
        color: #414d73;
      }
    }
    .adm-tab-bar-item-title-with-icon {
      margin-top: 4px;
    }
  }

  .adm-tab-bar-item-icon {
    height: 32px;
    font-size: 32px;

    svg {
      height: 32px;
      height: 32px;
    }
  }
`;
