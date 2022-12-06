import { useIntl } from 'react-intl';
import { ProOrderQueryListResponseAllOfDataAllOfDataItem } from '../../api/model';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { stringDateFormat } from '../../utils/date';
import { getOriginSymbol } from './utils';

interface RecordProps {
  data: ProOrderQueryListResponseAllOfDataAllOfDataItem;
}

const Record = ({ data }: RecordProps) => {
  const isCanceled = data.closeState === 'canceled';

  const intl = useIntl();

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-[#3D3A50] font-bold text-base">{getOriginSymbol(data.symbol)}</span>
          <span className="pl-2.5 text-[#663D3A50] text-xs">{`• ${data.buySellValue}`}</span>
          <span className="pl-2.5 text-[#661D3155] text-xs">{stringDateFormat(data.openTime)}</span>
        </div>
        <div className="flex items-center text-[#663D3A50]">
          <span className=" ml-1 mr-2">{data.nowStateDesc}</span>
          {!isCanceled && <Arrow />}
        </div>
      </div>
      <div className="mt-2 flex">
        <div className="flex-[1.2] flex flex-col">
          <span className="text-xs text-[#663D3A50]">
            {intl.formatMessage({ defaultMessage: '手数', id: 'xra9PO' })}
          </span>
          <span className="text-[#3D3A50] mt-1">{data.openHand}</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-xs text-[#663D3A50]">
            {isCanceled
              ? intl.formatMessage({ defaultMessage: '委託價', id: 'EN7oPQ' })
              : intl.formatMessage({ defaultMessage: '開倉價', id: 'ClVjxw' })}
          </span>
          <span className="text-[#3D3A50] mt-1">{data.price}</span>
        </div>
        <div className="flex-1 flex flex-col items-end">
          <span className="text-xs text-[#663D3A50]">
            {isCanceled
              ? intl.formatMessage({ defaultMessage: '開倉保證金', id: 'H4vld2' })
              : intl.formatMessage({ defaultMessage: '盈利(USDT)', id: 'aaQVo1' })}
          </span>
          <span className="text-[#3D3A50] mt-1">
            {isCanceled
              ? data.openBail
              : Number(data.profit) > 0
              ? `+${Number(data.profit)}`
              : `${data.profit}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Record;
