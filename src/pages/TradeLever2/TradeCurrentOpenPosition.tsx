import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PaginationResponseDataItem } from '../../api/model';
import useSwitchColor from '../../hooks/useSwitchColor';

const TradeCurrentOpenPosition = ({ data = [] }: { data?: PaginationResponseDataItem[] }) => {
  const getColor = useSwitchColor();

  const intl = useIntl();

  if (data.length === 0) {
    return (
      <span className="text-center p-10">
        {intl.formatMessage({ defaultMessage: '暫無數據', id: 'dqhJYx' })}
      </span>
    );
  }

  return (
    <>
      {data.map((v, i) => (
        <Link
          to={{
            pathname: '/position-details',
            search: stringify({
              symbol: v.symbol,
            }),
          }}
          key={i}
          className="p-4 bg-white"
        >
          <div className="flex">
            <div className="flex flex-col w-1/3">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '幣種', id: 'hDf8uN' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.symbol}</span>
            </div>
            <div className="flex flex-col w-1/3 items-center">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '數量/可用', id: 'cofepD' })}
              </span>
              <span className="text-sm text-[#3d3a50]">
                <div>{v.amount}</div>
                <div>{v.availableAmount}</div>
              </span>
            </div>
            <div className="flex flex-col w-1/3 items-center">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '成本', id: '27fLgJ' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.price}</span>
            </div>
            <div className="flex flex-col w-1/3 items-end">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '盈虧', id: 'zM3jHk' })}
              </span>
              <span className="text-sm text-[#3d3a50]" style={{ color: getColor(v.profit) }}>
                {v.profit}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default TradeCurrentOpenPosition;
