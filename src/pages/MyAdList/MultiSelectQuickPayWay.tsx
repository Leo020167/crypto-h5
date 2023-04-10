import { Grid } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { Receipt } from '../../api/model';
import { ReactComponent as SvgSelected } from '../../assets/ic_svg_selected.svg';

interface SelectWayPayAddProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  receipts?: Receipt[];
}
const SelectWayPayAdd = () => {
  const history = useHistory();
  const location = useLocation();
  return (
    <div
      className="flex h-14 items-center justify-center overflow-hidden rounded bg-[#F9F9FC] text-2xl font-bold text-[#3D3A50]"
      onClick={() => {
        history.push({
          pathname: '/add-receipt',
          search: stringify({ from: location.pathname }),
        });
      }}
    >
      +
    </div>
  );
};

const SelectWayPay = ({
  isSelected,
  data,
  onToggle,
}: {
  isSelected: boolean;
  data: Receipt;
  onToggle: (value: string) => void;
}) => {
  const intl = useIntl();
  return (
    <div
      className="flex h-14 flex-col items-center justify-center overflow-hidden rounded border border-transparent bg-[#F9F9FC] px-2 text-xs font-bold text-[#3D3A50] transition-all"
      style={{
        borderColor: isSelected ? '#6175AE' : '',
      }}
      onClick={() => onToggle(data.paymentId ?? '')}
    >
      <div className="flex items-center">
        <img alt="" src={data.receiptLogo} className="h-4 w-4" />
        <span className="ml-1">{data.receiptTypeValue}</span>
        <div className="scale-75 rounded border border-[#6175AE] px-1 py-0.5 text-[#6175AE]">
          {intl.formatMessage({ defaultMessage: '推薦', id: 'nGQJ81' })}
        </div>
      </div>

      <div className="relative mt-0.5 flex w-full items-center justify-center">
        <span className="scale-[0.85] rounded border border-[#6175AE] px-1 py-0.5 text-[#6175AE]">
          {intl.formatMessage({ defaultMessage: '價格最優', id: 'EYBWHx' })}
        </span>
        {isSelected && <SvgSelected className="absolute right-0 h-4 w-4" />}
      </div>
    </div>
  );
};

const MultiSelectQuickPayWay = ({ receipts = [], value, onChange }: SelectWayPayAddProps) => {
  const [selected, setSelected] = useState<string[]>(value ?? []);
  return (
    <Grid columns={3} gap={4}>
      {receipts.map((v) => (
        <Grid.Item key={v.paymentId}>
          <SelectWayPay
            isSelected={selected.includes(v.paymentId ?? '')}
            data={v}
            onToggle={(value: string) => {
              const newValue = selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value];

              setSelected(newValue);

              onChange?.(newValue);
            }}
          />
        </Grid.Item>
      ))}
      <Grid.Item>
        <SelectWayPayAdd />
      </Grid.Item>
    </Grid>
  );
};

export default MultiSelectQuickPayWay;
