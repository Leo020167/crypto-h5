import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Dropdown, DropdownRef, Grid, Selector } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import { useMemo, useRef, useState } from 'react';
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

  const navBarProps = useMemo(() => {
    return {
      right: (
        <div className="flex justify-end">
          <Dropdown ref={ref} arrow={<DownOutline />}>
            <Dropdown.Item key="sorter" title="筛选">
              <div className="p-4">
                <div className="flex-1 flex flex-col">
                  <div className="text-[#1D3155] text-base text-left">转出账户选择</div>
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
                  <div className="text-[#1D3155] text-base text-left">转入账户选择</div>
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
                      重置
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
                      确定
                    </Button>
                  </Grid.Item>
                </Grid>
              </div>
            </Dropdown.Item>
          </Dropdown>
        </div>
      ),
    };
  }, [fromAccountType, options, refetch, toAccountType]);

  return (
    <ScreenWithInfiniteScroll
      headerTitle="划转记录"
      dataSource={dataSource}
      navBarProps={navBarProps}
      renderItem={(item: QueryTransferListResponseAllOfDataAllOfDataItem, index) => {
        return (
          <div className="border-b border-b-gray-100 p-3" key={index}>
            <div className="flex justify-between mb-1.5 px-3 text-sm">
              <span className="text-gray-400">数量 USDT</span>
              <span className="text-xs text-[#4a575f]">{item.amount}</span>
            </div>
            <div className="flex justify-between mb-1.5 px-3 text-sm">
              <span className="text-gray-400">类型</span>
              <span className="text-xs text-[#4a575f]">{item.typeValue}</span>
            </div>
            <div className="flex justify-between px-3 text-sm">
              <span className="text-gray-400">时间</span>
              <span className="text-xs text-[#4a575f]">{stringDateFormat(item.createTime)}</span>
            </div>
          </div>
        );
      }}
      loadMore={async () => {
        fetchNextPage();
      }}
      hasMore={hasNextPage}
      onRefresh={refetch}
    />
  );
};

export default TransferCoinHistory;
