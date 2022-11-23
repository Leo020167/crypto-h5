import { Position } from '../../api/model/position';
import { getOriginSymbol } from '../TransactionRecords/utils';

const PositionItem = ({ data }: { data: Position }) => {
  return (
    <div className="p-4 flex">
      <div className="flex flex-col text-xs w-1/4">
        <div className="text-gray-400">幣種</div>
        <div className="text-sm font-bold mt-2">{getOriginSymbol(data.symbol)}</div>
      </div>
      <div className="flex flex-col text-xs w-1/4 items-center">
        <div className="text-gray-400">數量/可用</div>
        <div className="text-sm font-bold mt-2 text-center">
          <div>{Number(data.amount).toFixed(1) ?? '--'}</div>
          <div>{data.availableAmount ?? '--'}</div>
        </div>
      </div>
      <div className="flex flex-col text-xs w-1/4 items-center">
        <div className="text-gray-400">成本</div>
        <div className="text-sm font-bold mt-2">{data.price ?? '--'}</div>
      </div>
      <div className="flex flex-col text-xs w-1/4 items-end">
        <div className="text-gray-400">盈虧</div>
        <div
          className="text-sm font-bold mt-2"
          style={{
            color: Number(data.profit) < 0 ? '#CC1414' : '#14CC4B',
          }}
        >
          {data.profit}
        </div>
      </div>
    </div>
  );
};

export default PositionItem;
