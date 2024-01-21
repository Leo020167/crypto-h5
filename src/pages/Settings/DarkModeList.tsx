import { List, NavBar, Popup, Radio } from 'antd-mobile';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { darkModeAtom } from '../../atoms';

interface DarkModeListProps {
  open: boolean;
  onClose: () => void;
}

const DarkModeList = ({ open, onClose }: DarkModeListProps) => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const intl = useIntl();
  const modes = useMemo(
    () => [
      { label: intl.formatMessage({ defaultMessage: '日间模式', id: 'v4cfkr' }), value: 'light' },
      { label: intl.formatMessage({ defaultMessage: '夜间模式', id: 'F+MsId' }), value: 'dark' },
    ],
    [intl],
  );

  return (
    <Popup position="right" visible={open} onClose={onClose}>
      <div className="h-screen w-screen">
        <NavBar onBack={onClose}>
          {intl.formatMessage({ defaultMessage: '主题模式', id: 'jNvMHX' })}
        </NavBar>
        <div className="px-4 py-2">
          <div className="text-[#AAAAAA]">
            {intl.formatMessage({ defaultMessage: '主题模式设置', id: 'm1y4J3' })}
          </div>
        </div>

        <Radio.Group
          value={darkMode}
          onChange={(value) => {
            setDarkMode(value as 'dark' | 'light');
          }}
        >
          <div className="color-list">
            <List>
              {modes.map((v) => (
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
          </div>
        </Radio.Group>
      </div>
    </Popup>
  );
};

export default DarkModeList;
