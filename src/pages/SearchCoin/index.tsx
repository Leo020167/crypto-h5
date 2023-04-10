import { List, SearchBar } from 'antd-mobile';
import produce from 'immer';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { stringify } from 'query-string';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useSearchCoin } from '../../api/endpoints/transformer';
import { SearchResultListItem } from '../../api/model';
import Screen from '../../components/Screen';

export const searchCoinHistoryAtom = atomWithStorage<SearchResultListItem[]>(
  'search-coin-history',
  [],
);

const SearchCoin = () => {
  const intl = useIntl();
  const [value, setValue] = useState<string>('');

  const [accountType] = useQueryParam('accountType', withDefault(StringParam, ''));
  const { data } = useSearchCoin(
    { symbol: value, accountType },
    {
      query: {
        enabled: !!value,
      },
    },
  );
  const history = useHistory();

  const [searchCoinHistory, setSearchCoinHistory] = useAtom(searchCoinHistoryAtom);

  const goMarketPage = useCallback(
    (symbol?: string) => {
      history.push({
        pathname: accountType === 'spot' ? '/market2' : '/market',
        search: stringify({ symbol: symbol, isLever: 1, accountType }),
      });
    },
    [accountType, history],
  );

  return (
    <Screen>
      <div className="mt-4 px-4">
        <SearchBar
          placeholder={intl.formatMessage({ defaultMessage: '搜索代碼', id: 'I0saGO' })}
          onChange={setValue}
        />
      </div>
      <div className="flex-1">
        <List>
          {data?.data?.searchResultList?.map((v, i) => (
            <List.Item
              key={i}
              onClick={() => {
                setSearchCoinHistory(
                  produce((draft) => {
                    draft.unshift(v);
                  }),
                );

                goMarketPage(v.symbol);
              }}
            >
              <div>
                <span className="text-base font-bold text-[#1d3155]">{v.symbol}</span>
                <span className="ml-5 text-xs text-[#1d3155]">{v.name}</span>
              </div>
            </List.Item>
          ))}
        </List>
      </div>
      <div className="flex-1 px-5">
        <div className="flex items-center justify-between border-b py-2">
          <span className="text-xs text-[#999]">
            {intl.formatMessage({ defaultMessage: '歷史記錄', id: 'tAG5jn' })}
          </span>
          <a
            className="text-xs text-[#4562A5]"
            onClick={() => {
              setSearchCoinHistory([]);
            }}
          >
            {intl.formatMessage({ defaultMessage: '清空歷史', id: 'hxj1V+' })}
          </a>
        </div>
        <List>
          {searchCoinHistory.map((v, i) => (
            <List.Item
              key={i}
              onClick={() => {
                goMarketPage(v.symbol);
              }}
            >
              <div>
                <span className="text-base font-bold text-[#1d3155]">{v.symbol}</span>
                <span className="ml-5 text-xs text-[#1d3155]">{v.name}</span>
              </div>
            </List.Item>
          ))}
        </List>
      </div>
    </Screen>
  );
};

export default SearchCoin;
