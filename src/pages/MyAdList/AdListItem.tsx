import { Button } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { AdItem } from '../../api/model';
import ic_default_head from '../../assets/ic_default_head.png';
import { getReceipts } from '../../utils/response';

interface AdListItemProps {
  data: AdItem;
  onSetOnline: (data: AdItem) => void;
  onEdit: (data: AdItem) => void;
  onDelete: (data: AdItem) => void;
}
const AdListItem = ({ data, onSetOnline, onEdit, onDelete }: AdListItemProps) => {
  const receipts = useMemo(() => getReceipts(data.payWay), [data.payWay]);

  const intl = useIntl();

  const state = useMemo(() => {
    if (data.isOnline === '0') {
      return (
        <span className="scale-75 rounded bg-[#9A9A9A] px-1 py-0.5 text-white">
          {intl.formatMessage({ defaultMessage: '已下架', id: 'HbPiga' })}
        </span>
      );
    } else if (data.buySell === 'buy') {
      return (
        <span className="scale-75 rounded bg-[#E2214E] px-1 py-0.5 text-white">
          {intl.formatMessage({ defaultMessage: '購買中', id: '3a7HVy' })}
        </span>
      );
    }
    return (
      <span className="scale-75 rounded bg-[#00AD88] px-1 py-0.5 text-white">
        {intl.formatMessage({ defaultMessage: '出售中', id: 'pZSIhq' })}
      </span>
    );
  }, [data.buySell, data.isOnline, intl]);

  return (
    <Container className="p-4">
      <div className="flex items-center text-xs ">
        <div className="flex flex-1 items-center">
          <img
            alt=""
            src={data.userLogo ?? ic_default_head}
            className="h-6 w-6 overflow-hidden rounded-full"
          />
          <span className="ml-2 text-sm">{data.userName}</span>
          {state}
        </div>

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
          <span className="ml-4 text-base font-bold text-[#6175AE]">{data.price}</span>
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
        </div>

        <div className="mt-2 flex items-center text-gray-400">
          <span className="flex-1">
            {intl.formatMessage({ defaultMessage: '類型', id: 'K9M/Ln' })}
            {'buy' === data.buySell
              ? intl.formatMessage({ defaultMessage: '購買', id: 'eXPzpx' })
              : intl.formatMessage({ defaultMessage: '出售', id: '5zfR27' })}
          </span>
          <div className="flex gap-2">
            <Button className="w-16" onClick={() => onDelete(data)}>
              {intl.formatMessage({ defaultMessage: '刪除', id: 'oAdm61' })}
            </Button>
            <Button color="primary" className="w-16" onClick={() => onSetOnline(data)}>
              {data.isOnline === '0'
                ? intl.formatMessage({ defaultMessage: '上架', id: 'HaILNu' })
                : intl.formatMessage({ defaultMessage: '下架', id: 'Xagh1G' })}
            </Button>
            <Button color="primary" className="w-16" onClick={() => onEdit(data)}>
              {intl.formatMessage({ defaultMessage: '修改', id: 'BbSb0z' })}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-button {
    font-size: 12px;
  }
`;

export default AdListItem;
