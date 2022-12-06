import { useIntl } from 'react-intl';
import { Position } from '../../api/model/position';
import { getOriginSymbol } from '../TransactionRecords/utils';

const PositionItem = ({ data }: { data: Position }) => {
  const intl = useIntl();
  return (
    <div className="p-4">
      <div>
        <div className="text-sm font-bold mt-2">{getOriginSymbol(data.symbol)}</div>
      </div>
      <div className="flex mt-4">
        <div className="flex flex-col text-xs w-1/3">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '可用', id: '7C3q18' })}
          </div>
          <div className="text-sm font-bold mt-2">{data.availableAmount}</div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-center">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '委托', id: 'CKdped' })}
          </div>
          <div className="text-sm font-bold mt-2">{data.frozenAmount}</div>
        </div>
        <div className="flex flex-col text-xs w-1/3 items-end">
          <div className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '折合(USDT)', id: 'P+t8ta' })}
          </div>
          <div className="text-sm font-bold mt-2">{data.usdtAmount}</div>
        </div>
      </div>
    </div>
  );
};

export default PositionItem;
