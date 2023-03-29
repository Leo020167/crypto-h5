import { Popup, SearchBar } from 'antd-mobile';
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
      className={`flex py-2 px-4 ${isActive ? 'is-active' : ''}`}
      key={record.symbol}
      onClick={() => {
        onSelect?.(record);
      }}
    >
      <div className="flex-1 flex items-center">
        <div className=" font-bold text-sm text-black ">
          <span>{record.symbol}</span>
        </div>
      </div>
      <div className="text-xs text-right">
        <div className="mt-1 text-sm font-bold leading-none"> 1806.95 </div>

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

  return (
    <Container
      visible={visible}
      onMaskClick={onClose}
      position="left"
      bodyStyle={{ width: '228px' }}
    >
      <div className=" h-screen flex flex-col">
        <div className="p-2">
          <SearchBar
            placeholder={intl.formatMessage({ defaultMessage: '输入币种名称搜索', id: 'LaUwF3' })}
            onChange={setSearch}
            onSearch={setSearch}
          />
        </div>
        <div className="flex-1">
          <Scrollbars autoHide>
            {isLoading ? (
              <div className=" animate-pulse">
                {range(10).map((v) => (
                  <div className="h-10 px-4 flex items-center" key={v}>
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className=" divide-y divide-gray-200">
                {currencyFiltered.map((v) => (
                  <Currency
                    record={v}
                    key={v.symbol}
                    isActive={symbol === v.symbol}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </Scrollbars>
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
