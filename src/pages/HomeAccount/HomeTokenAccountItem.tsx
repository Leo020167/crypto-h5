import { useIntl } from 'react-intl';
import { AccountRecordListItem } from '../../api/model';
import { stringDateFormat } from '../../utils/date';

interface HomeTokenAccountItemProps {
  data: AccountRecordListItem;
}

const HomeTokenAccountItem = ({ data }: HomeTokenAccountItemProps) => {
  const intl = useIntl();
  return (
    <div className="text-sm px-4">
      <div>{data.remark}</div>
      <div className="flex text-gray-500 mt-4">
        <div className="flex flex-col w-1/3 text-xs">
          <div>{intl.formatMessage({ defaultMessage: '數量(Liegt)', id: 'aD/9at' })}</div>
          <div className="mt-2" style={{ color: data.inOut === '1' ? '#14CC4B' : '#C4311D' }}>
            {data.amount ?? '0.00'}
          </div>
        </div>
        <div className="flex flex-col w-1/3 items-center text-xs">
          <div>{intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}</div>
          <div className="mt-2">
            {intl.formatMessage({ defaultMessage: '已成功', id: '4NqD9g' })}
          </div>
        </div>
        <div className="flex flex-col w-1/3 items-end text-xs">
          <div>{intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}</div>
          <div className="mt-2 text-right">
            {stringDateFormat(data.createTime, 'YYYY-MM-DD HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTokenAccountItem;
