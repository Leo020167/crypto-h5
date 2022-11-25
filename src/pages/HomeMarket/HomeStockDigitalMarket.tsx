import { List } from 'antd-mobile';
import { stringify } from 'query-string';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useMarketData } from '../../market/endpoints/marketWithTransformer';
import HomeMarketItem from './HomeMarketItem';

const HomeStockDigitalMarket = ({ tab }: { tab: string }) => {
  const { data } = useMarketData({
    sortField: '',
    sortType: '',
    tab: tab,
  });

  const history = useHistory();

  return (
    <Container className="h-full flex flex-col text-xs">
      <div className="text-[#666175ae] flex items-center justify-between text-center h-10 px-4">
        <div className="min-w-[100px] text-left">
          <span>名稱代碼</span>
        </div>
        <div className="flex-1">
          <span>最新價</span>
        </div>
        <div className="min-w-[80px]">
          <span>漲跌幅</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <List>
          {data?.data?.quotes?.map((v, i) => (
            <List.Item
              key={i}
              onClick={() => {
                history.push({
                  pathname: '/market',
                  search: stringify({
                    symbol: v.symbol,
                    isLever: '',
                    accountType: tab,
                  }),
                });
              }}
              arrow={null}
            >
              <HomeMarketItem data={v} />
            </List.Item>
          ))}
        </List>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-list {
    --padding-left: 0;
    --padding-right: 0;
    --border-inner: 0;
    --border-top: 0;
    --border-bottom: 0;

    .adm-list-item:nth-child(odd) {
      background-color: #f6f7f8;
    }
  }
`;

export default HomeStockDigitalMarket;
