import { useIntl } from 'react-intl';
import { Position } from '../../api/model/position';
import useSwitchColor from '../../hooks/useSwitchColor';
import { getOriginSymbol } from '../TransactionRecords/utils';

const PositionItem = ({ data }: { data: Position }) => {
  const intl = useIntl();
  const getColor = useSwitchColor();
  return (
    <div className="px-4">
      <div className="flex mt-4">
        <div className="flex flex-col text-xs w-1/3">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '幣種', id: 'hDf8uN' })}
          </div>
          <div className="text-sm font-bold mt-2">{getOriginSymbol(data.symbol)}</div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-center">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '數量/可用', id: 'cofepD' })}
          </div>
          <div className="text-sm font-bold mt-2">
            <div>{data.amount}</div>
            <div>{data.availableAmount}</div>
          </div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-center">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '成本', id: '27fLgJ' })}
          </div>
          <div className="text-sm font-bold mt-2">{data.price}</div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-end">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '盈虧', id: 'zM3jHk' })}
          </div>
          <div className="text-sm font-bold mt-2" style={{ color: getColor(data.profit) }}>
            {data.profit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionItem;
