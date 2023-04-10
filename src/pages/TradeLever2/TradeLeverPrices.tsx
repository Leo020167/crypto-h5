import { useIntl } from 'react-intl';
import useSwitchColor from '../../hooks/useSwitchColor';
import { QuoteReal } from '../../market/model';

const TradeLeverPrices = ({ data }: { data?: QuoteReal }) => {
  const getColor = useSwitchColor();

  const color = getColor(Number(data?.rate));

  const intl = useIntl();

  return (
    <div className="text-xs">
      <div className="flex items-center text-[#bebebe]">
        <span className="w-1/2">
          {intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}({data?.currency})
        </span>
        <span className="w-1/2 text-right">
          {intl.formatMessage({ defaultMessage: '數量(手)', id: '+ZvENE' })}
        </span>
      </div>

      <div className="mt-4">
        {data?.buys?.map((v, i) => (
          <div key={i} className="relative flex items-center justify-between py-1">
            <div
              className="absolute right-0 h-full bg-gray-100"
              style={{ width: Number(v.depthRate) + '%' }}
            ></div>

            <span style={{ color: '#00AD88' }} className="z-10">
              {v.price}
            </span>
            <span className="z-10 mr-4 text-[#969696]">{v.amount}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-base font-bold text-[#00ad88]" style={{ color }}>
        {data?.last}
      </div>

      <div className="mt-4">
        {data?.buys?.map((v, i) => (
          <div key={i} className="relative flex items-center justify-between py-1">
            <div
              className="absolute right-0 h-full bg-gray-100"
              style={{ width: Number(v.depthRate) + '%' }}
            ></div>

            <span style={{ color: '#E2214E' }} className="z-10">
              {v.price}
            </span>
            <span className="z-10 mr-4 text-[#969696]">{v.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeLeverPrices;
