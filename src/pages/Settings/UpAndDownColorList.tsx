import { List, NavBar, Popup, Radio } from 'antd-mobile';
import { useAtom } from 'jotai';
import { UpAndDownColorAtom } from '../../atoms';

interface UpAndDownColorListProps {
  open: boolean;
  onClose: () => void;
}

const colors = [
  { label: '绿涨红跌', value: '1' },
  { label: '红涨绿跌', value: '0' },
];

const UpAndDownColorList = ({ open, onClose }: UpAndDownColorListProps) => {
  const [upAndDownColor, setUpAndDownColor] = useAtom(UpAndDownColorAtom);
  return (
    <Popup position="right" visible={open} onClose={onClose}>
      <div className="w-screen h-screen">
        <NavBar onBack={onClose}>涨跌颜色</NavBar>
        <div className="px-4 py-2">
          <div className="text-[#b4b4b4]">涨跌颜色设置</div>
        </div>

        <Radio.Group
          value={upAndDownColor}
          onChange={(value) => {
            setUpAndDownColor(value as string);
          }}
        >
          <List>
            {colors.map((v) => (
              <List.Item
                key={v.value}
                extra={
                  <div onClick={(e) => e.stopPropagation()}>
                    <Radio value={v.value} />
                  </div>
                }
              >
                {v.label}
              </List.Item>
            ))}
          </List>
        </Radio.Group>
      </div>
    </Popup>
  );
};

export default UpAndDownColorList;
