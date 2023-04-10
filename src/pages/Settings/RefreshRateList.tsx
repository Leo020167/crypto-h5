import { List, NavBar, Popup, Radio } from 'antd-mobile';
import { useAtom } from 'jotai';
import { range } from 'lodash-es';
import { useIntl } from 'react-intl';
import { refreshRateAtom } from '../../atoms';

interface RefreshRateListProps {
  open: boolean;
  onClose: () => void;
}

const values = range(1, 6);

const RefreshRateList = ({ open, onClose }: RefreshRateListProps) => {
  const [refreshRate, setRefreshRate] = useAtom(refreshRateAtom);

  const intl = useIntl();
  return (
    <Popup position="right" visible={open} onClose={onClose}>
      <div className="h-screen w-screen">
        <NavBar onBack={onClose}>
          {intl.formatMessage({ defaultMessage: '刷新频率设置', id: 'E7wFmB' })}
        </NavBar>
        <div className="px-4 py-2">
          <div className="text-[#b4b4b4]">
            {intl.formatMessage({ defaultMessage: '行情刷新频率设置', id: '/4Nsnx' })}
          </div>
        </div>

        <Radio.Group
          value={refreshRate}
          onChange={(value) => {
            setRefreshRate(value as number);
          }}
        >
          <List>
            {values.map((v) => (
              <List.Item
                key={v}
                extra={
                  <div onClick={(e) => e.stopPropagation()}>
                    <Radio value={v} />
                  </div>
                }
              >
                {intl.formatMessage(
                  { defaultMessage: '{second}秒', id: '0oAu54' },
                  {
                    second: v,
                  },
                )}
              </List.Item>
            ))}
          </List>
        </Radio.Group>
      </div>
    </Popup>
  );
};

export default RefreshRateList;
