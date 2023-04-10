import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { OtcFindAdListItem } from '../api/model';
import ic_default_head from '../assets/ic_default_head.png';
import { getReceipts } from '../utils/response';

interface OptionalListItemProps {
  buySell?: string;
  data: OtcFindAdListItem;
  onClick?: (item: OtcFindAdListItem) => void;
}
const OptionalListItem = ({ buySell, data, onClick }: OptionalListItemProps) => {
  const intl = useIntl();
  const receipts = useMemo(() => getReceipts(data.payWay), [data.payWay]);
  return (
    <div className="p-4">
      <div className="flex items-center text-xs ">
        <img
          alt=""
          src={data.userLogo ?? ic_default_head}
          className="h-6 w-6 overflow-hidden rounded-full"
        />
        <span className="ml-2 flex-1 text-sm">{data.userName}</span>

        <span className="text-gray-400">{data.orderNum}</span>
        <span className="mx-4 h-3 w-[1px] bg-gray-400"></span>
        <span className="text-gray-400">{data.limitRate}%</span>
      </div>

      <div className="mt-4 text-xs">
        <div className="flex items-center">
          <span className="flex-1 text-gray-400">
            {intl.formatMessage({ defaultMessage: '數量', id: 'YYra8Q' })}
            {data.amount} USDT
          </span>
          <span className="ml-4 text-gray-400">
            {intl.formatMessage({ defaultMessage: '單價', id: 'WyPuru' })}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <span className="flex-1 text-gray-400">
            {intl.formatMessage({ defaultMessage: '限額', id: 'zGwnHi' })}
            {`${data.minCny}USDT-${data.maxCny}USDT`}
          </span>
          <span className="ml-4 text-base font-bold text-[#6175AE]">
            {data.currencySign}
            {data.price}
          </span>
        </div>

        <div className="mt-2 flex items-center">
          <span className="text-gray-400">
            {intl.formatMessage({ defaultMessage: '方式', id: 'O3bb/6' })}
          </span>
          <div className="ml-2 flex-1" key="payWay">
            {receipts.map((v) => (
              <img key={v.paymentId} alt="" src={v.receiptLogo} className="mr-1 h-4 w-4" />
            ))}
          </div>
          <a
            className=" flex h-8 w-16 items-center justify-center bg-[#6175AE] text-xs text-white"
            onClick={() => onClick?.(data)}
          >
            {buySell === 'buy'
              ? intl.formatMessage({ defaultMessage: '購買', id: 'eXPzpx' })
              : intl.formatMessage({ defaultMessage: '出售', id: '5zfR27' })}
          </a>
        </div>
      </div>
    </div>
  );
};

export default OptionalListItem;
