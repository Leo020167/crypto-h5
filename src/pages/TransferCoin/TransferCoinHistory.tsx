import { Button, Dropdown, DropdownRef, Grid } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import { useMemo, useRef } from 'react';
import ScreenWithInfiniteScroll from '../../components/ScreenWithInfiniteScroll';

const TransferCoinHistory = () => {
  const ref = useRef<DropdownRef>(null);
  const navBarProps = useMemo(() => {
    return {
      right: (
        <div className="flex justify-end">
          <Dropdown ref={ref} arrow={<DownOutline />}>
            <Dropdown.Item key="sorter" title="筛选">
              <div className="p-4">
                <div className="flex-1 flex flex-col">
                  <div className="text-[#1D3155] text-base text-left">转出账户选择</div>
                  <Grid columns={3} gap={8} className="mt-1.5 mb-8">
                    <Grid.Item>
                      <a className="h-full block text-[#1D3155] text-xs bg-[#f2f2f2] text-center py-2.5 rounded overflow-hidden">
                        余额账户
                      </a>
                    </Grid.Item>
                    <Grid.Item>
                      <a className="h-full block text-[#1D3155] text-xs  bg-[#f2f2f2] text-center py-2.5 rounded overflow-hidden">
                        余额账户
                      </a>
                    </Grid.Item>
                    <Grid.Item>
                      <a className="h-full block text-[#1D3155] text-xs  bg-[#f2f2f2] text-center py-2.5 rounded overflow-hidden">
                        余额账户
                      </a>
                    </Grid.Item>
                    <Grid.Item>
                      <a className="h-full block text-[#1D3155] text-xs  bg-[#f2f2f2] text-center py-2.5 rounded overflow-hidden">
                        余额账户
                      </a>
                    </Grid.Item>
                  </Grid>
                </div>

                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <a className="h-full block text-[#1D3155] text-sm bg-[#f2f2f2] text-center py-2.5 rounded overflow-hidden">
                      重置
                    </a>
                  </Grid.Item>
                  <Grid.Item>
                    <Button block color="primary">
                      <span className="text-sm">确定</span>
                    </Button>
                  </Grid.Item>
                </Grid>
              </div>
            </Dropdown.Item>
          </Dropdown>
        </div>
      ),
    };
  }, []);

  return (
    <ScreenWithInfiniteScroll
      headerTitle="划转记录"
      dataSource={[1]}
      navBarProps={navBarProps}
      renderItem={(item: any) => {
        return (
          <div className="border-b border-b-gray-100 p-3">
            <div className="flex justify-between mb-1.5 px-3 text-sm">
              <span className="text-gray-400">数量 USDT</span>
              <span className="text-xs text-[#4a575f]">1</span>
            </div>
            <div className="flex justify-between mb-1.5 px-3 text-sm">
              <span className="text-gray-400">类型</span>
              <span className="text-xs text-[#4a575f]">余额账户 -&gt; 跟单账户</span>
            </div>
            <div className="flex justify-between px-3 text-sm">
              <span className="text-gray-400">时间</span>
              <span className="text-xs text-[#4a575f]">20-11-18 14:54</span>
            </div>
          </div>
        );
      }}
      loadMore={async () => {
        //
      }}
      hasMore={false}
    />
  );
};

export default TransferCoinHistory;
