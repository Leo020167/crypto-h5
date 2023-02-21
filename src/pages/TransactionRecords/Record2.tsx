import { useIntl } from 'react-intl';
import useSwitchColor from '../../hooks/useSwitchColor';
import { stringDateFormat } from '../../utils/date';
import { getOriginSymbol } from './utils';

interface RecordProps {
  data: any;
}

const Record2 = ({ data }: RecordProps) => {
  const intl = useIntl();

  const getColor = useSwitchColor();
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-[#3D3A50] font-bold text-base">{getOriginSymbol(data.symbol)}</span>
          <span
            className={`pl-2.5 text-xs ${
              data.buySell === 'buy' ? 'text-[#14CC4B]' : 'text-[#CC1414]'
            }`}
          >{`• ${data.buySellValue}`}</span>
          <span className="pl-2.5 text-[#661D3155] text-xs">{stringDateFormat(data.openTime)}</span>
        </div>
        <div className="flex items-center text-gray-400 text-xs">
          <span className="mr-1">
            {intl.formatMessage({ defaultMessage: '盈利', id: 'IrxrMw' })}
            <span style={{ color: getColor(data.profit) }} className="ml-1">
              {data.profit}
            </span>
          </span>
          <span>
            手續費 <span className="text-black">{data.fee}</span>
          </span>
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
        <div className="flex-[1.2] flex flex-col">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
          </span>
          <span className="text-[#3D3A50] mt-1">{data.amount}</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}
          </span>
          <span className="text-[#3D3A50] mt-1">{data.price}</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '金額(USDT)', id: 's4hlhW' })}
          </span>
          <span className="text-[#3D3A50] mt-1">{Number(data.price) * Number(data.amount)}</span>
        </div>
        <div className="flex-1 flex flex-col items-end">
          <span className=" text-gray-400">
            {intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
          </span>
          <span className="text-[#3D3A50] mt-1">{stringDateFormat(data.updateTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default Record2;
