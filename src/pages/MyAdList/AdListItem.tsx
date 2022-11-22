import { Button } from 'antd-mobile';
import { useMemo } from 'react';
import styled from 'styled-components';
import { AdItem } from '../../api/model';
import ic_default_head from '../../assets/ic_default_head.png';
import { getReceipts } from '../../utils/response';

interface AdListItemProps {
  data: AdItem;
  onSetOnline: (data: AdItem) => void;
  onEdit: (data: AdItem) => void;
  onDelete: (data: AdItem) => void;
}
const AdListItem = ({ data, onSetOnline, onEdit, onDelete }: AdListItemProps) => {
  const receipts = useMemo(() => getReceipts(data.payWay), [data.payWay]);

  const state = useMemo(() => {
    if (data.isOnline === '0') {
      return <span className="bg-[#9A9A9A] text-white px-1 py-0.5 rounded scale-75">已下架</span>;
    } else if (data.buySell === 'buy') {
      return <span className="bg-[#E2214E] text-white px-1 py-0.5 rounded scale-75">購買中</span>;
    }
    return <span className="bg-[#00AD88] text-white px-1 py-0.5 rounded scale-75">出售中</span>;
  }, [data.buySell, data.isOnline]);

  return (
    <Container className="p-4">
      <div className="flex items-center text-xs ">
        <div className="flex-1 flex items-center">
          <img
            alt=""
            src={data.userLogo ?? ic_default_head}
            className="w-6 h-6 rounded-full overflow-hidden"
          />
          <span className="ml-2 text-sm">{data.userName}</span>
          {state}
        </div>

        <span className="text-gray-400">{data.orderNum}</span>
        <span className="h-3 mx-4 bg-gray-400 w-[1px]"></span>
        <span className="text-gray-400">{data.limitRate}%</span>
      </div>

      <div className="text-xs mt-4">
        <div className="flex items-center">
          <span className="flex-1 text-gray-400">數量{data.amount} USDT</span>
          <span className="ml-4 text-gray-400">單價</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="flex-1 text-gray-400">
            限額{`${data.minCny}USDT-${data.maxCny}USDT`}
          </span>
          <span className="ml-4 text-[#6175AE] text-base font-bold">{data.price}</span>
        </div>

        <div className="mt-2 flex items-center">
          <span className="text-gray-400">方式</span>
          <div className="flex-1 ml-2" key="payWay">
            {receipts.map((v) => (
              <img key={v.paymentId} alt="" src={v.receiptLogo} className="w-4 h-4 mr-1" />
            ))}
          </div>
        </div>

        <div className="text-gray-400 mt-2 flex items-center">
          <span className="flex-1">類型{'buy' === data.buySell ? '購買' : '出售'}</span>
          <div className="flex gap-2">
            <Button className="w-16" onClick={() => onDelete(data)}>
              刪除
            </Button>
            <Button color="primary" className="w-16" onClick={() => onSetOnline(data)}>
              {data.isOnline === '0' ? '上架' : '下架'}
            </Button>
            <Button color="primary" className="w-16" onClick={() => onEdit(data)}>
              修改
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-button {
    font-size: 12px;
  }
`;

export default AdListItem;
