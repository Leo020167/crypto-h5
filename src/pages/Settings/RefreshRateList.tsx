import { List, NavBar, Popup, Radio } from 'antd-mobile';
import { useAtom } from 'jotai';
import { range } from 'lodash-es';
import { refreshRateAtom } from '../../atoms';

interface RefreshRateProps {
  open: boolean;
  onClose: () => void;
}

const values = range(1, 6);

const RefreshRateList = ({ open, onClose }: RefreshRateProps) => {
  const [refreshRate, setRefreshRate] = useAtom(refreshRateAtom);
  return (
    <Popup position="right" visible={open} onClose={onClose}>
      <div className="w-screen h-screen">
        <NavBar onBack={onClose}>刷新频率设置</NavBar>
        <div className="border-b px-4 py-2">
          <div className="text-[#b4b4b4]">行情刷新频率设置</div>
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
              >{`${v}秒`}</List.Item>
            ))}
          </List>
        </Radio.Group>
      </div>
    </Popup>
  );
};

export default RefreshRateList;
