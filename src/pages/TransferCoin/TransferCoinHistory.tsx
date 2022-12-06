import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Dropdown, DropdownRef, Grid, Selector } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  accountQueryTransferList,
  getAccountQueryTransferListQueryKey,
  useAccountListAccountType,
} from '../../api/endpoints/transformer';
import { QueryTransferListResponseAllOfDataAllOfDataItem } from '../../api/model';
import ScreenWithInfiniteScroll from '../../components/ScreenWithInfiniteScroll';
import { stringDateFormat } from '../../utils/date';

const TransferCoinHistory = () => {
  const ref = useRef<DropdownRef>(null);

  const { data: listAccountType } = useAccountListAccountType({
    query: {},
  });

  const options = useMemo(() => {
    if (listAccountType?.data?.accountTypeList?.length) {
      return listAccountType.data.accountTypeList?.map((v) => ({
        label: v.accountName,
        value: v.accountType ?? '',
      }));
    }
    return [];
  }, [listAccountType?.data?.accountTypeList]);

  const [fromAccountType, setFromAccountType] = useState<string[]>([]);
  const [toAccountType, setToAccountType] = useState<string[]>([]);

  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: getAccountQueryTransferListQueryKey({ pageNo: 1 }),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await accountQueryTransferList({
        pageNo: pageParam,
        fromAccountType: fromAccountType?.[0] ?? '',
        toAccountType: toAccountType?.[0] ?? '',
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (Number(lastPage?.pageSize) === lastPage?.data?.length ?? 0) {
        return Number(lastPage?.pageNo) + 1;
      }
    },
  });

  const dataSource = useMemo(
    () => data?.pages.map((v) => v?.data ?? []).flat() ?? [],
    [data?.pages],
  );

  const intl = useIntl();

  const navBarProps = useMemo(() => {
    return {
      right: (
        <div className="flex justify-end">
          <Dropdown ref={ref} arrow={<DownOutline />}>
            <Dropdown.Item
              key="sorter"
              title={intl.formatMessage({ defaultMessage: '筛选', id: 'C8ZFaR' })}
            >
              <div className="p-4">
                <div className="flex-1 flex flex-col">
                  <div className="text-[#1D3155] text-base text-left">
                    {intl.formatMessage({ defaultMessage: '转出账户选择', id: 'V1f0Zb' })}
                  </div>
                  <Selector
                    className="mt-1.5 mb-8"
                    columns={3}
                    showCheckMark={false}
                    options={options}
                    value={fromAccountType}
                    onChange={setFromAccountType}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="text-[#1D3155] text-base text-left">
                    {intl.formatMessage({ defaultMessage: '转入账户选择', id: 'h24vu5' })}
                  </div>
                  <Selector
                    className="mt-1.5 mb-8"
                    columns={3}
                    showCheckMark={false}
                    options={options}
                    value={toAccountType}
                    onChange={setToAccountType}
                  />
                </div>

                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <Button
                      className="h-full block text-[#1D3155] text-sm bg-[#f2f2f2] text-center py-2.5 rounded overflow-hidden"
                      fill="none"
                      block
                      onClick={() => {
                        setFromAccountType([]);
                        setToAccountType([]);
                        ref.current?.close();
                        refetch();
                      }}
                    >
                      {intl.formatMessage({ defaultMessage: '重置', id: 'r2dEd/' })}
                    </Button>
                  </Grid.Item>
                  <Grid.Item>
                    <Button
                      block
                      color="primary"
                      onClick={() => {
                        ref.current?.close();
                        refetch();
                      }}
                    >
                      {intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' })}
                    </Button>
                  </Grid.Item>
                </Grid>
              </div>
            </Dropdown.Item>
          </Dropdown>
        </div>
      ),
    };
  }, [fromAccountType, intl, options, refetch, toAccountType]);

  return (
    <ScreenWithInfiniteScroll
      headerTitle={intl.formatMessage({ defaultMessage: '划转记录', id: 't+gJ2j' })}
      dataSource={dataSource}
      navBarProps={navBarProps}
      renderItem={(item: QueryTransferListResponseAllOfDataAllOfDataItem, index) => {
        return (
          <div className="border-b border-b-gray-100 p-3" key={index}>
            <div className="flex justify-between mb-1.5 px-3 text-sm">
              <span className="text-gray-400">
                {intl.formatMessage({ defaultMessage: '数量 USDT', id: 's/KbuC' })}
              </span>
              <span className="text-xs text-[#4a575f]">{item.amount}</span>
            </div>
            <div className="flex justify-between mb-1.5 px-3 text-sm">
              <span className="text-gray-400">
                {intl.formatMessage({ defaultMessage: '类型', id: '5FboZ/' })}
              </span>
              <span className="text-xs text-[#4a575f]">{item.typeValue}</span>
            </div>
            <div className="flex justify-between px-3 text-sm">
              <span className="text-gray-400">
                {intl.formatMessage({ defaultMessage: '时间', id: 'DpnauN' })}
              </span>
              <span className="text-xs text-[#4a575f]">{stringDateFormat(item.createTime)}</span>
            </div>
          </div>
        );
      }}
      loadMore={async () => {
        await fetchNextPage();
      }}
      hasMore={hasNextPage}
      onRefresh={refetch}
    />
  );
};

export default TransferCoinHistory;
