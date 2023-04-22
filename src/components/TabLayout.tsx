import { TabBar } from 'antd-mobile';
import { ReactNode, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as HomeTabAccount } from '../assets/home_tab_account.svg';
import { ReactComponent as HomeTabSvg } from '../assets/home_tab_cropyme.svg';
import { ReactComponent as HomeTabFollow } from '../assets/home_tab_follow.svg';
import { ReactComponent as HomeTabMarkSvg } from '../assets/home_tab_mark.svg';
import { ReactComponent as HomeTabMineSvg } from '../assets/home_tab_mine.svg';

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
      },
      {
        key: '/home/market',
        title: intl.formatMessage({ defaultMessage: '行情', id: 'Hv1Nr8' }),
        icon: <HomeTabMarkSvg className="h-6" />,
      },
      {
        key: '/home/account',
        title: intl.formatMessage({ defaultMessage: '賬戶', id: 'R4Ww2H' }),
        icon: <HomeTabAccount className="h-6" />,
      },
      {
        key: '/trade-lever2',
        title: intl.formatMessage({ defaultMessage: '交易', id: '/ErIar' }),
        icon: <HomeTabFollow className="h-6" />,
      },
      {
        key: '/home/my',
        title: intl.formatMessage({ defaultMessage: '我的', id: '/I+pby' }),
        icon: <HomeTabMineSvg className="h-6" />,
      },
    ],
    [intl],
  );
  return (
    <Container>
      <div className="content flex flex-col">{children}</div>
      <TabBar
        activeKey={location.pathname}
        onChange={(key) => {
          if (key === '/trade-lever2') {
            history.push('/trade-lever2?buySell=1&symbol=BTC');
          } else {
            history.push(key);
          }
        }}
        className="layout fixed bottom-0 left-0 right-0 z-10 bg-white"
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </Container>
  );
};
const Container = styled.div`
  .content {
    height: calc(100vh - 50px);
  }
`;
