import { ErrorBlock, List, SpinLoading } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { refreshRateAtom } from '../../atoms';
import { useMarketData } from '../../market/endpoints/marketWithTransformer';
import HomeMarketItem from './HomeMarketItem';

const HomeStockDigitalMarket = ({ tab, activeKey }: { tab: string; activeKey: string }) => {
  const { data, isLoading, refetch } = useMarketData({
    sortField: '',
    sortType: '',
    tab: tab,
  });

  const refreshRate = useAtomValue(refreshRateAtom);

  useInterval(
    () => {
      refetch();
    },
    tab === activeKey ? refreshRate * 1000 : null,
  );

  const history = useHistory();

  const intl = useIntl();

  const quotes = data?.data?.quotes ?? [];

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
        {quotes.map((item, i) => (
          <List.Item
            key={i}
            arrow={null}
            className="relative"
            onClick={() => {
              if (tab === 'spot') {
                history.push({
                  pathname: '/market2',
                  search: stringify({
                    symbol: item.symbol,
                    isLever: 1,
                  }),
                });
              } else {
                history.push({
                  pathname: '/market',
                  search: stringify({
                    symbol: item.symbol,
                    isLever: 1,
                    accountType: tab,
                  }),
                });
              }
            }}
          >
            <HomeMarketItem data={item} sort={i} />
          </List.Item>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .list {
    .adm-list-item,
    .adm-list-item-content-main {
      padding: 0;
    }

    .adm-list-item:nth-child(odd) {
      background: rgba(0, 0, 0, 0.04);
    }
  }
`;

export default HomeStockDigitalMarket;
