import { PaginationResponseDataItem } from '../../api/model';
import { stringDateFormat } from '../../utils/date';

const TradeCurrentCommission = ({
  data = [],
  onCancel,
}: {
  data?: PaginationResponseDataItem[];
  onCancel?: (orderId: string) => void;
}) => {
  if (data.length === 0) {
    return <span className="text-center p-10">暫無數據</span>;
  }

  return (
    <>
      {data.map((v, i) => (
        <div key={i} className="p-4 bg-white">
          <div className="flex items-center">
            <div className="flex items-center flex-1">
              <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
              <span className="text-xs text-gray-400 ml-2">{v.buySellValue}</span>
              <span className="text-xs text-gray-400 ml-2">{stringDateFormat(v.openTime)}</span>
            </div>

            <a
              className=" h-6 w-12 border flex items-center justify-center text-xs text-[#969696]"
              onClick={() => {
                onCancel?.(v.orderId);
              }}
            >
              撤銷
            </a>
          </div>
          <div className="flex mt-2.5">
            <div className="flex flex-col w-1/3">
              <span className="text-xs text-gray-400">手數</span>
              <span className="text-sm text-[#3d3a50]">{v.openHand}</span>
            </div>
            <div className="flex flex-col w-1/3 items-center">
              <span className="text-xs text-gray-400">委托價</span>
              <span className="text-sm text-[#3d3a50]">{v.price}</span>
            </div>
            <div className="flex flex-col w-1/3 items-end">
              <span className="text-xs text-gray-400">開倉保證金</span>
              <span className="text-sm text-[#3d3a50]">{v.openBail}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TradeCurrentCommission;
