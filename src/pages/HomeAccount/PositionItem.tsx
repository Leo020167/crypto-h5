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
        <div className="mt-2 text-sm font-bold">{getOriginSymbol(data.symbol)}</div>
      </div>
      <div className="mt-4 flex">
        <div className="flex w-1/3 flex-col text-xs">
          <div className="text-gray-400 dark:text-[#AAAAAA]">
            {intl.formatMessage({ defaultMessage: '可用', id: '7C3q18' })}
          </div>
          <div className="mt-2 text-sm font-bold dark:text-white">{data.availableAmount}</div>
        </div>
        <div className="flex w-1/3 flex-col items-center text-xs">
          <div className="text-gray-400 dark:text-[#AAAAAA]">
            {intl.formatMessage({ defaultMessage: '委托', id: 'CKdped' })}
          </div>
          <div className="mt-2 text-sm font-bold dark:text-white">{data.frozenAmount}</div>
        </div>
        <div className="flex w-1/3 flex-col items-end text-xs">
          <div className="text-gray-400 dark:text-[#AAAAAA]">
            {intl.formatMessage({ defaultMessage: '折合(USDT)', id: 'P+t8ta' })}
          </div>
          <div className="mt-2 text-sm font-bold dark:text-white">{data.usdtAmount}</div>
        </div>
      </div>

      {['ETH', 'USDT', 'BTC'].includes(data.symbol ?? '') && (
        <div className="item-center mt-4 flex">
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
            color="primary"
            fill="outline"
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
