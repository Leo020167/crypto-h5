import { useMemo } from 'react';
import { OtcFindAdListItem } from '../api/model';
import ic_default_head from '../assets/ic_default_head.png';
import { getReceipts } from '../utils/response';

interface OptionalListItemProps {
  buySell?: string;
  data: OtcFindAdListItem;
  onClick?: (item: OtcFindAdListItem) => void;
}
const OptionalListItem = ({ buySell, data, onClick }: OptionalListItemProps) => {
  const receipts = useMemo(() => getReceipts(data.payWay), [data.payWay]);
  return (
    <div className="p-4">
      <div className="flex items-center text-xs ">
        <img
          alt=""
          src={data.userLogo ?? ic_default_head}
          className="w-6 h-6 rounded-full overflow-hidden"
        />
        <span className="flex-1 ml-2 text-sm">{data.userName}</span>

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
          <span className="ml-4 text-[#6175AE] text-base font-bold">
            {data.currencySign}
            {data.price}
          </span>
        </div>

        <div className="mt-2 flex items-center">
          <span className="text-gray-400">方式</span>
          <div className="flex-1 ml-2" key="payWay">
            {receipts.map((v) => (
              <img key={v.paymentId} alt="" src={v.receiptLogo} className="w-4 h-4 mr-1" />
            ))}
          </div>
          <a
            className=" h-8 w-16 text-white bg-[#6175AE] text-xs flex items-center justify-center"
            onClick={() => onClick?.(data)}
          >
            {buySell === 'buy' ? '購買' : '出售'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default OptionalListItem;
