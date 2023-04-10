import { List, NavBar, Popup, Radio } from 'antd-mobile';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { switchColorValueAtom } from '../../atoms';

interface UpAndDownColorListProps {
  open: boolean;
  onClose: () => void;
}

const UpAndDownColorList = ({ open, onClose }: UpAndDownColorListProps) => {
  const [upAndDownColor, setUpAndDownColor] = useAtom(switchColorValueAtom);
  const intl = useIntl();
  const colors = useMemo(
    () => [
      { label: intl.formatMessage({ defaultMessage: '绿涨红跌', id: 'zJbCuR' }), value: '1' },
      { label: intl.formatMessage({ defaultMessage: '红涨绿跌', id: '6w/mMH' }), value: '0' },
    ],
    [intl],
  );

  return (
    <Popup position="right" visible={open} onClose={onClose}>
      <div className="h-screen w-screen">
        <NavBar onBack={onClose}>
          {intl.formatMessage({ defaultMessage: '涨跌颜色', id: 'o3hkNu' })}
        </NavBar>
        <div className="px-4 py-2">
          <div className="text-[#b4b4b4]">
            {intl.formatMessage({ defaultMessage: '涨跌颜色设置', id: 'OxlDIl' })}
          </div>
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
