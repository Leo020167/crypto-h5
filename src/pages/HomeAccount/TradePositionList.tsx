import { stringify } from 'query-string';
import { Link } from 'react-router-dom';
import { Position } from '../../api/model';
import ic_arrow from '../../assets/ic_arrow.png';
import useSwitchColor from '../../hooks/useSwitchColor';

const TradePositionList = ({ data = [] }: { data?: Position[] }) => {
  const getColor = useSwitchColor();

  return (
    <div className="flex flex-col">
      {data.map((v, i) => (
        <Link
          to={{
            pathname: '/lever-info',
            search: stringify({
              orderId: v.orderId,
            }),
          }}
          key={i}
          className="p-4 bg-white mb-2"
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
              <span className="text-xs text-gray-400">手數</span>
              <span className="text-sm text-[#3d3a50]">{v.openHand}</span>
            </div>
            <div className="flex flex-col w-1/3 items-center">
              <span className="text-xs text-gray-400">開倉價</span>
              <span className="text-sm text-[#3d3a50]">{v.openPrice}</span>
            </div>
            <div className="flex flex-col w-1/3 items-end">
              <span className="text-xs text-gray-400">盈虧(USDT)</span>
              <span className="text-sm text-[#3d3a50]" style={{ color: getColor(v.profit) }}>
                {Number(v.profit) >= 0 ? '+' : ''}
                {v.profit}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TradePositionList;
