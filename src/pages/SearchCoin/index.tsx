import { List, SearchBar } from 'antd-mobile';
import { atomWithStorage } from 'jotai/utils';
import { stringify } from 'query-string';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useSearchCoin } from '../../api/endpoints/transformer';
import { SearchResultListItem } from '../../api/model';
import { Symbol } from '../../components';
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

  return (
    <Screen
      headerTitle={
        <SearchBar
          className="w-full"
          placeholder={intl.formatMessage({ defaultMessage: '搜索代碼', id: 'I0saGO' })}
          onChange={setValue}
        />
      }
    >
      <div className="flex-1">
        <List>
          {data?.data?.searchResultList?.map((v, i) => (
            <List.Item key={i}>
              <Symbol
                name={v.name}
                linkProps={{
                  to: {
                    pathname: accountType === 'spot' ? '/market2' : '/market',
                    search: stringify({ symbol: v.symbol, isLever: 1, accountType }),
                  },
                }}
              />
            </List.Item>
          ))}
        </List>
      </div>
    </Screen>
  );
};

export default SearchCoin;
