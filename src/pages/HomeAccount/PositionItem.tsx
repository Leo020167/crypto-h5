import { Position } from '../../api/model/position';
import { getOriginSymbol } from '../TransactionRecords/utils';

const PositionItem = ({ data }: { data: Position }) => {
  return (
    <div className="p-4">
      <div>
        <div className="text-sm font-bold mt-2">{getOriginSymbol(data.symbol)}</div>
      </div>
      <div className="flex mt-4">
        <div className="flex flex-col text-xs w-1/3">
          <div className="text-gray-400">可用</div>
          <div className="text-sm font-bold mt-2">{data.availableAmount}</div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-center">
          <div className="text-gray-400">委托</div>
          <div className="text-sm font-bold mt-2">{data.frozenAmount}</div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-end">
          <div className="text-gray-400">折合(USDT)</div>
          <div className="text-sm font-bold mt-2">{data.usdtAmount}</div>
        </div>
      </div>
    </div>
  );
};

export default PositionItem;
