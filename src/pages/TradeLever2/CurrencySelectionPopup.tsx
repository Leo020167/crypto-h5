import { ErrorBlock, Popup, SearchBar } from 'antd-mobile';
import { useAtom, useAtomValue } from 'jotai';
import { range } from 'lodash-es';
import { Scrollbars } from 'rc-scrollbars';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { refreshRateAtom, switchColorValueAtom } from '../../atoms';
import { useMarketData } from '../../market/endpoints/marketWithTransformer';
import { Quote } from '../../market/model';

type CurrencyListPopupProps = {
  symbol: string;
  visible: boolean;
  onClose?: () => void;
  onSelect?: (item: Quote) => void;
};

const Currency = ({
  record,
  isActive,
  onSelect,
}: {
  record: Quote;
  isActive: boolean;
  onSelect?: (item: Quote) => void;
}) => {
  const [upDownColor] = useAtom(switchColorValueAtom);
  const rate = Number(record.rate ?? 0);
  const color = useMemo(() => {
    if (upDownColor === '0') {
      if (rate > 0) return '#E2214E';
      else if (rate === 0 || rate === -100) return '#555555';
      return '#00AD88';
    } else {
      if (rate > 0) return '#00AD88';
      else if (rate === 0 || rate === -100) return '#555555';
      return '#E2214E';
    }
  }, [rate, upDownColor]);

  const ratePrefix = rate >= 0 ? '+' : '';

  return (
    <div
      className={`flex px-4 py-2 dark:bg-[#3D424E] ${isActive ? 'is-active' : ''}`}
      key={record.symbol}
      onClick={() => {
        onSelect?.(record);
      }}
    >
      <div className="flex flex-1 items-center">
        <div className=" text-sm font-bold text-black dark:text-white">
          <span>{record.symbol}</span>
        </div>
      </div>
      <div className="text-right text-xs">
        <div className="mt-1 text-sm font-bold leading-none">{record.price}</div>

        <div className="text-up" style={{ color }}>
          {ratePrefix + record.rate}%
        </div>
      </div>
    </div>
  );
};

export const CurrencyListPopup = (props: CurrencyListPopupProps) => {
  const { symbol, visible, onClose, onSelect } = props;

  const intl = useIntl();

  const { data, isLoading, refetch } = useMarketData({
    sortField: '',
    sortType: '',
    tab: 'spot',
  });

  const refreshRate = useAtomValue(refreshRateAtom);

  useInterval(
    () => {
      refetch();
    },
    visible ? refreshRate * 1000 : null,
  );

  const items = useMemo(() => data?.data?.quotes ?? [], [data?.data?.quotes]);

  const [search, setSearch] = useState('');
  const currencyFiltered = useMemo(() => {
    return items.filter((v) => v.symbol?.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className=" animate-pulse">
          {range(10).map((v) => (
            <div className="flex h-10 items-center px-4" key={v}>
              <div className="h-4 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      );
    }

    if (currencyFiltered.length === 0) {
      return <ErrorBlock status="empty" />;
    }

    return (
      <div className=" divide-y divide-gray-200 dark:divide-[#161720]">
        {currencyFiltered.map((v) => (
          <Currency record={v} key={v.symbol} isActive={symbol === v.symbol} onSelect={onSelect} />
        ))}
      </div>
    );
  }, [currencyFiltered, isLoading, onSelect, symbol]);

  return (
    <Container
      visible={visible}
      onMaskClick={onClose}
      position="left"
      bodyStyle={{ width: '228px' }}
    >
      <div className=" flex h-screen flex-col">
        <div className="p-2">
          <SearchBar
            placeholder={intl.formatMessage({ defaultMessage: '输入币种名称搜索', id: 'LaUwF3' })}
            onChange={setSearch}
            onSearch={setSearch}
          />
        </div>
        <div className="flex-1">
          <Scrollbars autoHide>{content}</Scrollbars>
        </div>
      </div>
    </Container>
  );
};

const Container = styled(Popup)`
  .is-active {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
