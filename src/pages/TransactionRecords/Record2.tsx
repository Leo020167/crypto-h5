import { useIntl } from 'react-intl';
import { stringDateFormat } from '../../utils/date';
import { getOriginSymbol } from './utils';

interface RecordProps {
  data: any;
}

const Record2 = ({ data }: RecordProps) => {
  const intl = useIntl();

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-base font-bold text-[#3D3A50]">{getOriginSymbol(data.symbol)}</span>
          <span
            className={`pl-2.5 text-xs ${
              data.buySell === 'buy' ? 'text-[#14CC4B]' : 'text-[#CC1414]'
            }`}
          >{`• ${data.buySellValue}`}</span>
          <span className="pl-2.5 text-xs text-[#661D3155]">{stringDateFormat(data.openTime)}</span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          手續費{data.fee}
          <span className="ml-1">
            {data.state === '-1'
              ? intl.formatMessage({ defaultMessage: '已撤销', id: 'zznr09' })
              : data.state === '0'
              ? intl.formatMessage({ defaultMessage: '未成交', id: 'JVD8BD' })
              : intl.formatMessage({ defaultMessage: '已成交', id: 'KLriKo' })}
          </span>
        </div>
      </div>
      <div className="mt-2 flex text-xs">
        <div className="flex flex-[1.2] flex-col">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
          </span>
          <span className="mt-1 text-[#3D3A50]">{data.amount}</span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
          </span>
          <span className="mt-1 text-[#3D3A50]">{data.price}</span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '金額(USDT)', id: 's4hlhW' })}
          </span>
          <span className="mt-1 text-[#3D3A50]">{Number(data.price) * Number(data.amount)}</span>
        </div>
        <div className="flex flex-1 flex-col items-end">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
          </span>
          <span className="mt-1 text-[#3D3A50]">{stringDateFormat(data.updateTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default Record2;
