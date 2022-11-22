import { Grid } from 'antd-mobile';
import { stringify } from 'query-string';
import { useState } from 'react';
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
      className="bg-[#F9F9FC] text-[#3D3A50] font-bold h-14 flex items-center justify-center text-2xl overflow-hidden rounded"
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
  return (
    <div
      className="bg-[#F9F9FC] text-[#3D3A50] font-bold h-14 flex flex-col items-center justify-center text-xs px-2 border border-transparent overflow-hidden rounded transition-all"
      style={{
        borderColor: isSelected ? '#6175AE' : '',
      }}
      onClick={() => onToggle(data.paymentId ?? '')}
    >
      <div className="flex items-center">
        <img alt="" src={data.receiptLogo} className="w-4 h-4" />
        <span className="ml-1">{data.receiptTypeValue}</span>
        <div className="border border-[#6175AE] text-[#6175AE] px-1 py-0.5 rounded scale-75">
          推薦
        </div>
      </div>

      <div className="flex items-center justify-center relative w-full mt-0.5">
        <span className="border border-[#6175AE] text-[#6175AE] px-1 py-0.5 rounded scale-[0.85]">
          價格最優
        </span>
        {isSelected && <SvgSelected className="w-4 h-4 absolute right-0" />}
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
