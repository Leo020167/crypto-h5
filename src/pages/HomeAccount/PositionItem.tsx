import { Button } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Position } from '../../api/model/position';
import { getOriginSymbol } from '../TransactionRecords/utils';

const PositionItem = ({ data }: { data: Position }) => {
  const intl = useIntl();
  const history = useHistory();
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

      {['ETH', 'USDT', 'BTC'].includes(data.symbol ?? '') && (
        <div className="mt-4 flex item-center">
          <Button
            color="primary"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();

              history.push({
                pathname: '/recharge-coin',
                search: stringify({
                  symbol: data.symbol,
                }),
              });
            }}
          >
            {intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}
          </Button>
          <div className="w-2"></div>
          <Button
            className="flex-1 text-center"
            onClick={(e) => {
              e.stopPropagation();

              history.push({
                pathname: '/take-coin',
                search: stringify({
                  symbol: data.symbol,
                }),
              });
            }}
          >
            {intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PositionItem;
