import { useIntl } from 'react-intl';
import { QuoteReal } from '../../market/model';
import { stringDateFormat } from '../../utils/date';

const DealList = ({ real }: { real?: QuoteReal }) => {
  const intl = useIntl();
  console.log(real);
  return (
    <div className=" mt-2">
      <div className="flex items-center">
        <span className="text-xs text-[#626073] flex-1 ml-2.5">
          {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
        </span>
        <span className="text-xs text-[#626073] flex-1 text-center">
          {intl.formatMessage({ defaultMessage: '方向', id: '4hv39Z' })}
        </span>
        <span className="text-xs text-[#626073] flex-1 text-center">
          {intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
        </span>
        <span className="text-xs text-[#626073] flex-1 mr-2.5 text-right">
          {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
        </span>
      </div>

      {real?.dealList?.map((v, i) => (
        <div className="flex items-center pt-2.5" key={i}>
          <span className="text-xs text-[#626073] flex-1 ml-2.5">
            {stringDateFormat(v.time as any, 'HH:mm:ss')}
          </span>
          <span
            className="text-xs text-[#626073] flex-1 text-center"
            style={{ color: v.buySell === 'buy' ? '#E2214E' : '#00AD88' }}
          >
            {v.buySell === 'buy'
              ? intl.formatMessage({ defaultMessage: '看漲(做多)', id: 'cBWJI5' })
              : intl.formatMessage({ defaultMessage: '看跌(做空)', id: 'uy59Hz' })}
          </span>
          <span className="text-xs text-[#626073] flex-1 text-center">{v.price}</span>
          <span className="text-xs text-[#626073] flex-1 mr-2.5 text-right">{v.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default DealList;
