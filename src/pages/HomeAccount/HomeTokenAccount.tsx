import { List } from 'antd-mobile';
import styled from 'styled-components';
import { useAccountRecordList } from '../../api/endpoints/transformer';
import { AccountInfo } from '../../api/model';
import HomeTokenAccountItem from './HomeTokenAccountItem';

interface HomeTokenAccountProps {
  account?: AccountInfo;
}
const HomeTokenAccount = ({ account }: HomeTokenAccountProps) => {
  const { data } = useAccountRecordList({ pageNo: '1' });

  return (
    <Container className="bg-gray-100">
      <div className="p-4 bg-white">
        <div className="mb-2 text-gray-400 text-right text-xs">
          <a href="/procoin/article/#/passgeDetail?article_id=222" target="__blank">
            查看如何獲取TFU
          </a>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">總資產(TFU)</div>
            <div className="text-base">{account?.assets ?? '0'}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-400">市值(USDT)</div>
            <div>{account?.assetsCny ?? '0'}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">可用(USDT)</div>
            <div>{account?.holdAmount ?? '0'}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-400">凍結(USDT)</div>
            <div>{account?.frozenAmount ?? '0'}</div>
          </div>
        </div>
      </div>

      <div className="mt-2.5 bg-white p-4">
        <span className="text-base">財務記錄</span>
      </div>
      <List>
        {data?.data?.data?.map((v) => (
          <List.Item key={v.id}>
            <HomeTokenAccountItem data={v} />
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 0;
  }
`;

export default HomeTokenAccount;
