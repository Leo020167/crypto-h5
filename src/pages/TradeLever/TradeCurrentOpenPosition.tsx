import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PaginationResponseDataItem } from '../../api/model';
import ic_arrow from '../../assets/ic_arrow.png';
import useSwitchColor from '../../hooks/useSwitchColor';

const TradeCurrentOpenPosition = ({ data = [] }: { data?: PaginationResponseDataItem[] }) => {
  const getColor = useSwitchColor();

  const intl = useIntl();

  if (data.length === 0) {
    return (
      <span className="p-10 text-center">
        {intl.formatMessage({ defaultMessage: '暫無數據', id: 'dqhJYx' })}
      </span>
    );
  }

  return (
    <>
      {data.map((v, i) => (
        <Link
          to={{
            pathname: '/lever-info',
            search: stringify({
              orderId: v.orderId,
            }),
          }}
          key={i}
          className="bg-white p-4"
        >
          <div className="flex items-center">
            <div className="flex flex-1 items-center">
              <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
              <span className="ml-2 flex-1 text-xs text-gray-400">{v.buySellValue}</span>
            </div>
            <img alt="" src={ic_arrow} className="h-4" />
          </div>
          <div className="mt-2.5 flex">
            <div className="flex w-1/3 flex-col">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '手數', id: 'g4FQPM' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.openHand}</span>
            </div>
            <div className="flex w-1/3 flex-col items-center">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '開倉價', id: 'ClVjxw' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.openPrice}</span>
            </div>
            <div className="flex w-1/3 flex-col items-end">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '盈虧(USDT)', id: '/k9TmU' })}
              </span>
              <span className="text-sm text-[#3d3a50]" style={{ color: getColor(v.profit) }}>
                {Number(v.profit) >= 0 ? '+' : ''}
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
