import { ErrorBlock, List, Switch } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AccountInfo } from '../../api/model';
import PositionItem from './PositionItem';

type PositionListProps = {
  account?: AccountInfo;
};
export const PositionList = ({ account }: PositionListProps) => {
  const history = useHistory();

  const [checked, setChecked] = useState(false);

  const openList = useMemo(() => {
    const openList = account?.openList || [];

    if (checked) {
      return openList.filter((v) => Number(v.availableAmount) > 0);
    }

    return openList;
  }, [account?.openList, checked]);

  const content = useMemo(() => {
    if (openList.length === 0) {
      return (
        <div className="py-10">
          <ErrorBlock status="empty" title="" description="" />
        </div>
      );
    }
    return (
      <List>
        {openList.map((v, i) => (
          <List.Item
            key={i}
            arrow={null}
            onClick={() => {
              if (v.symbol === 'USDT') return;

              history.push({
                pathname: '/position-details',
                search: stringify({ symbol: v.symbol }),
              });
            }}
          >
            <PositionItem data={v} />
          </List.Item>
        ))}
      </List>
    );
  }, [history, openList]);

  return (
    <div className="bg-white">
      <div className="flex items-center px-4">
        <Switch checked={checked} onChange={setChecked} />
        <div className="ml-2">隐藏小余额</div>
      </div>
      {content}
    </div>
  );
};
