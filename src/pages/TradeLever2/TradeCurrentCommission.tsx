import { useIntl } from 'react-intl';
import { useProOrderQueryList } from '../../api/endpoints/transformer';
import { stringDateFormat } from '../../utils/date';

const TradeCurrentCommission = ({ onCancel }: { onCancel?: (orderId: string) => void }) => {
  const intl = useIntl();

  const { data } = useProOrderQueryList({
    symbol: '',
    accountType: 'spot',
    buySell: '',
    pageNo: '1',
    orderState: '0',
    isDone: '1',
    type: '2',
  });

  if (data?.data?.data?.length === 0) {
    return (
      <span className="text-center p-10">
        {intl.formatMessage({ defaultMessage: '暫無數據', id: 'dqhJYx' })}
      </span>
    );
  }

  return (
    <>
      {data?.data?.data?.map((v, i) => (
        <div key={i} className="p-4 bg-white">
          <div className="flex items-center">
            <div className="flex items-center flex-1">
              <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
              <span className="text-xs text-gray-400 ml-2">{v.buySellValue}</span>
              <span className="text-xs text-gray-400 ml-2">{stringDateFormat(v.openTime)}</span>
            </div>

            <a
              className=" h-6 w-12 border flex items-center justify-center text-xs text-[#969696]"
              onClick={() => {
                onCancel?.(v.orderId);
              }}
            >
              {intl.formatMessage({ defaultMessage: '撤銷', id: 'hEtJ5h' })}
            </a>
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
                {intl.formatMessage({ defaultMessage: '委托價', id: 'ehbGQt' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.price}</span>
            </div>
            <div className="flex flex-col w-1/3 items-end">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '總金額(USDT)', id: 'jBc8s4' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.sum}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TradeCurrentCommission;
