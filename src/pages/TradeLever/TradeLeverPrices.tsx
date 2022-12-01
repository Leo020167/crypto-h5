import useSwitchColor from '../../hooks/useSwitchColor';
import { QuoteReal } from '../../market/model';

const TradeLeverPrices = ({ data }: { data?: QuoteReal }) => {
  const getColor = useSwitchColor();

  const color = getColor(Number(data?.rate));

  return (
    <div className="text-xs">
      <div className="text-[#bebebe] flex items-center">
        <span className="flex-1">價格({data?.currency})</span>
        <span className="flex-1 ml-4">數量(手)</span>
      </div>

      <div className="mt-4">
        {data?.buys?.map((v, i) => (
          <div key={i} className="flex items-center justify-between py-1 relative">
            <div
              className="absolute bg-gray-100 right-0 h-full"
              style={{ width: Number(v.depthRate) + '%' }}
            ></div>

            <span style={{ color: '#00AD88' }} className="z-10">
              {v.price}
            </span>
            <span className="mr-4 text-[#969696] z-10">{v.amount}</span>
          </div>
        ))}
      </div>

      <div className="text-[#00ad88] text-base font-bold mt-4" style={{ color }}>
        {data?.last}
      </div>
      <div className="text-[#d6d6d6]">{data?.lastCny}</div>

      <div className="mt-4">
        {data?.buys?.map((v, i) => (
          <div key={i} className="flex items-center justify-between py-1 relative">
            <div
              className="absolute bg-gray-100 right-0 h-full"
              style={{ width: Number(v.depthRate) + '%' }}
            ></div>

            <span style={{ color: '#E2214E' }} className="z-10">
              {v.price}
            </span>
            <span className="mr-4 text-[#969696] z-10">{v.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeLeverPrices;
