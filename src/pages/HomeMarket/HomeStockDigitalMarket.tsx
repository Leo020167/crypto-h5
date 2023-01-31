import { useTrail, animated } from '@react-spring/web';
import { ErrorBlock, SpinLoading } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { switchColorValueAtom } from '../../atoms';
import { useMarketData } from '../../market/endpoints/marketWithTransformer';
import HomeMarketItem from './HomeMarketItem';

const HomeStockDigitalMarket = ({ tab, activeKey }: { tab: string; activeKey: string }) => {
  const upDownColor = useAtomValue(switchColorValueAtom);

  const getBackgroundColor = useCallback(
    (rate: number) => {
      if (upDownColor === '0') {
        if (rate > 0) return 'rgba(226, 33, 78, 0.65)';
        else if (rate === 0 || rate === -100) return '#555555';
        return 'rgba(0, 173, 136, 0.65)';
      } else {
        if (rate > 0) return 'rgba(0, 173, 136, 0.65)';
        else if (rate === 0 || rate === -100) return '#555555';
        return 'rgba(226, 33, 78, 0.65)';
      }
    },
    [upDownColor],
  );

  const { data, isLoading, refetch } = useMarketData({
    sortField: '',
    sortType: '',
    tab: tab,
  });

  useInterval(
    () => {
      refetch();
    },
    tab === activeKey ? 3000 : null,
  );

  const history = useHistory();

  const intl = useIntl();

  const quotes = useMemo(() => data?.data?.quotes ?? [], [data?.data?.quotes]);

  const [trails] = useTrail(
    quotes.length,
    (i) => {
      return {
        from: { opacity: 1 },
        to: { opacity: 0 },
        delay: i % 3 === 0 ? i * 100 : i % 2 === 0 ? i * 180 : i * 140,
        config: {
          mass: 3,
        },
      };
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinLoading color="primary" />
      </div>
    );
  }

  if (data?.data?.quotes?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorBlock status="empty" />
      </div>
    );
  }

  return (
    <Container className="h-full flex flex-col text-xs">
      <div className="text-[#666175ae] flex items-center justify-between text-center h-10 px-4">
        <div className="min-w-[100px] text-left">
          <span>{intl.formatMessage({ defaultMessage: '名稱代碼', id: 'ymJBTR' })}</span>
        </div>
        <div className="flex-1">
          <span>{intl.formatMessage({ defaultMessage: '最新價', id: 'iipjBw' })}</span>
        </div>
        <div className="min-w-[80px]">
          <span>{intl.formatMessage({ defaultMessage: '漲跌幅', id: 'gA15gF' })}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto list">
        {trails.map(({ opacity }, i) => (
          <animated.a
            className="relative"
            key={i}
            onClick={() => {
              if (tab === 'spot') {
                history.push({
                  pathname: '/market2',
                  search: stringify({
                    symbol: quotes[i].symbol,
                    isLever: 1,
                  }),
                });
              } else {
                history.push({
                  pathname: '/market',
                  search: stringify({
                    symbol: quotes[i].symbol,
                    isLever: 1,
                    accountType: tab,
                  }),
                });
              }
            }}
          >
            <animated.div
              className="absolute top-0 right-0 bottom-0 left-0 z-10"
              style={{ backgroundColor: getBackgroundColor(Number(quotes[i].rate)), opacity }}
            ></animated.div>
            <HomeMarketItem data={quotes[i]} />
          </animated.a>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .list a {
    display: block;
    padding: 12px 0;
  }
`;

export default HomeStockDigitalMarket;
