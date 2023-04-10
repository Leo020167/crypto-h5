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
      <span className="p-10 text-center">
        {intl.formatMessage({ defaultMessage: '暫無數據', id: 'dqhJYx' })}
      </span>
    );
  }

  return (
    <>
      {data?.data?.data?.map((v, i) => (
        <div key={i} className="bg-white p-4">
          <div className="flex items-center">
            <div className="flex flex-1 items-center">
              <span className="text-base font-bold text-[#3d3a50]">{v.symbol}</span>
              <span className="ml-2 text-xs text-gray-400">{v.buySellValue}</span>
              <span className="ml-2 text-xs text-gray-400">{stringDateFormat(v.openTime)}</span>
            </div>

            <a
              className=" flex h-6 w-12 items-center justify-center border text-xs text-[#969696]"
              onClick={() => {
                onCancel?.(v.orderId);
              }}
            >
              {intl.formatMessage({ defaultMessage: '撤銷', id: 'hEtJ5h' })}
            </a>
          </div>
          <div className="mt-2.5 flex">
            <div className="flex w-1/3 flex-col">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '数量', id: 'fFmyYM' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.amount}</span>
            </div>
            <div className="flex w-1/3 flex-col items-center">
              <span className="text-xs text-gray-400">
                {intl.formatMessage({ defaultMessage: '委托價', id: 'ehbGQt' })}
              </span>
              <span className="text-sm text-[#3d3a50]">{v.price}</span>
            </div>
            <div className="flex w-1/3 flex-col items-end">
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
