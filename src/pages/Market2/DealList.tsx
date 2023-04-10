import { useIntl } from 'react-intl';
import { QuoteReal } from '../../market/model';
import { stringDateFormat } from '../../utils/date';

const DealList = ({ real }: { real?: QuoteReal }) => {
  const intl = useIntl();

  return (
    <div className=" mt-2">
      <div className="flex items-center">
        <span className="ml-2.5 flex-1 text-xs text-[#626073]">
          {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
        </span>
        <span className="flex-1 text-center text-xs text-[#626073]">
          {intl.formatMessage({ defaultMessage: '方向', id: '4hv39Z' })}
        </span>
        <span className="flex-1 text-center text-xs text-[#626073]">
          {intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
        </span>
        <span className="mr-2.5 flex-1 text-right text-xs text-[#626073]">
          {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
        </span>
      </div>

      {real?.dealList?.map((v, i) => (
        <div className="flex items-center pt-2.5" key={i}>
          <span className="ml-2.5 flex-1 text-xs text-[#626073]">
            {stringDateFormat(v.time as any, 'HH:mm:ss')}
          </span>
          <span
            className="flex-1 text-center text-xs text-[#626073]"
            style={{ color: v.buySell === 'buy' ? '#E2214E' : '#00AD88' }}
          >
            {v.buySell === 'buy'
              ? intl.formatMessage({ defaultMessage: '看漲(做多)', id: 'cBWJI5' })
              : intl.formatMessage({ defaultMessage: '看跌(做空)', id: 'uy59Hz' })}
          </span>
          <span className="flex-1 text-center text-xs text-[#626073]">{v.price}</span>
          <span className="mr-2.5 flex-1 text-right text-xs text-[#626073]">{v.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default DealList;
