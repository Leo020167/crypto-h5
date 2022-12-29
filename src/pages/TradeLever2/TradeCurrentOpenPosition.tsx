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
            pathname: '/lever-info',
            search: stringify({
              orderId: v.orderId,
            }),
          }}
          key={i}
          className="p-4 bg-white"
        >
          <div className="flex items-center">
            <div className="flex items-center flex-1">
              <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
              <span className="text-xs text-gray-400 ml-2 flex-1">{v.buySellValue}</span>
            </div>
            <img alt="" src={ic_arrow} className="h-4" />
          </div>
          <div className="flex mt-2.5">
            <div className="flex flex-col w-1/3">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '数量', id: 'fFmyYM' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.amount}</span>
            </div>
            <div className="flex flex-col w-1/3 items-center">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '成本', id: '27fLgJ' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.price}</span>
            </div>
            <div className="flex flex-col w-1/3 items-end">
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
