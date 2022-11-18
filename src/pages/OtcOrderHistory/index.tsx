import { Button, Dropdown, DropdownRef, Grid, Selector } from 'antd-mobile';
import { useRef } from 'react';
import ScreenWithInfiniteScroll from '../../components/ScreenWithInfiniteScroll';

const OtcOrderHistory = () => {
  const ref = useRef<DropdownRef>(null);
  return (
    <ScreenWithInfiniteScroll
      headerTitle="订单记录"
      navBarProps={{
        right: (
          <Dropdown ref={ref}>
            <Dropdown.Item key="sorter" title="筛选">
              <div className="p-4">
                <div className="flex-1 flex flex-col">
                  <div className="text-[#1D3155] text-base">类型选择</div>
                  <Selector
                    className="mt-1.5 mb-8"
                    columns={4}
                    options={[
                      {
                        label: '选购',

                        value: '1',
                      },
                      {
                        label: '出售',

                        value: '2',
                      },
                    ]}
                    defaultValue={['1']}
                    showCheckMark={false}
                  />
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
        ),
      }}
      dataSource={[]}
      renderItem={() => {
        return <div></div>;
      }}
      loadMore={async (isRetry) => {
        //
      }}
      hasMore={false}
    />
  );
};

export default OtcOrderHistory;
