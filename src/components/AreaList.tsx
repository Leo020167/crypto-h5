import { List, Popup, SearchBar } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { areaListAtom } from '../atoms';
import { AreaListItem } from '../model';

interface AreaListProps {
  open: boolean;
  onClose: () => void;
  onSelect: (area: AreaListItem) => void;
}
const AreaList = ({ open, onClose, onSelect }: AreaListProps) => {
  const areaList = useAtomValue(areaListAtom);

  const [search, setSearch] = useState<string>();

  const filtered = areaList.filter((v) => {
    if (search?.trim().length) {
      return [v.deName, v.enName, v.tcName]
        .join('')
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
    }
    return true;
  });

  return (
    <Popup
      position="right"
      visible={open}
      showCloseButton
      onClose={onClose}
      bodyClassName="w-full h-screen pt-10 flex"
      destroyOnClose
    >
      <div className="phone-prefix-number flex flex-col w-full">
        <div className="mb-4 px-4">
          <SearchBar placeholder="搜索家或地区" onChange={setSearch} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <List>
            {filtered.map((v, index) => (
              <List.Item
                key={v.enName + index}
                extra={v.areaCode}
                arrow={null}
                onClick={() => onSelect(v)}
              >
                {v.tcName}
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    </Popup>
  );
};

export default AreaList;
