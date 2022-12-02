import {
  Button,
  Dropdown,
  DropdownRef,
  Grid,
  Input,
  List,
  NavBar,
  Popup,
  Selector,
  Swiper,
  SwiperRef,
  Tabs,
} from 'antd-mobile';
import { DownFill, DownOutline } from 'antd-mobile-icons';
import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useProOrderQuerySum } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import TradeCommissionHistory from './TradeCommissionHistory';
import TradeLeverHistory, { TradeLeverHistoryRef } from './TradeLeverHistory';

interface AccountType {
  value: string;
  label: string;
}
const accountTypes: AccountType[] = [
  { value: 'follow', label: '跟單交易記錄' },
  { value: 'stock', label: '全球期指交易記錄' },
  { value: 'digital', label: '合約交易記錄' },
  { value: 'spot', label: '幣幣交易記錄' },
];

const tabItems = [
  { key: '1', title: '委托记录' },
  { key: '2', title: '历史记录' },
];

const proOrderQuerySumKeys = ['stock', 'digital'];

const AccountTypeParam = withDefault(StringParam, 'follow');

const TransactionRecords = () => {
  const [visible, setVisible] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [symbol, setSymbol] = useState<string>();
  const [orderState, setOrderState] = useState<string[]>([]);

  const [accountType, setAccountType] = useQueryParam('accountType', AccountTypeParam);

  const accountTypeOption = useMemo(
    () => accountTypes.find((v) => v.value === accountType),
    [accountType],
  );

  const { data: proOrderQuerySum } = useProOrderQuerySum(
    { accountType: accountType ?? '' },
    {
      query: {
        enabled: !!accountType,
      },
    },
  );

  const ref = useRef<DropdownRef>(null);

  const historyRef = useRef<TradeLeverHistoryRef>(null);

  return (
    <Screen
      headerTitle={
        <a className="flex items-center justify-center text-base" onClick={() => setVisible(true)}>
          {accountTypeOption?.label}
          <div className="ml-1 w-2.5 h-2.5">
            <DownFill className="h-full w-full" />
          </div>
        </a>
      }
      navBarProps={{
        right: (
          <div className="flex justify-end">
            {activeIndex === 1 && (
              <Dropdown ref={ref} arrow={<DownOutline />}>
                <Dropdown.Item key="sorter" title="筛选">
                  <div className="p-4">
                    <div className="flex-1 flex flex-col">
                      <div className="text-[#1D3155] text-base text-left">币种</div>
                      <Input
                        className="bg-[#f9fafd] rounded h-10 pl-2.5 mt-2.5"
                        placeholder="請輸入幣種"
                      />
                    </div>

                    <div className="flex-1 flex flex-col mt-5">
                      <div className="text-[#1D3155] text-base text-left">订单状态</div>
                      <Selector
                        className="mt-2.5 mb-8"
                        columns={3}
                        showCheckMark={false}
                        options={[
                          { label: '已成交', value: 'filled' },
                          { label: '已撤销', value: 'canceled' },
                        ]}
                        value={orderState}
                        onChange={setOrderState}
                      />
                    </div>

                    <Grid columns={2} gap={8}>
                      <Grid.Item>
                        <Button
                          block
                          onClick={() => {
                            setSymbol('');
                            setOrderState([]);
                            ref.current?.close();
                            historyRef.current?.refetch();
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
                            historyRef.current?.refetch();
                          }}
                        >
                          确定
                        </Button>
                      </Grid.Item>
                    </Grid>
                  </div>
                </Dropdown.Item>
              </Dropdown>
            )}
          </div>
        ),
      }}
    >
      <Container>
        <div className="flex">
          <Tabs
            stretch={false}
            activeKey={tabItems[activeIndex].key}
            onChange={(key) => {
              const index = tabItems.findIndex((item) => item.key === key);
              setActiveIndex(index);
              swiperRef.current?.swipeTo(index);
            }}
          >
            {tabItems.map((item) => (
              <Tabs.Tab title={item.title} key={item.key} />
            ))}
          </Tabs>

          {proOrderQuerySumKeys.includes(accountType) && (
            <div className="flex-1 flex items-center justify-end px-4">
              <div className="flex flex-col">
                <span className="text-xs text-[#999999]">總交易手數</span>
                <span className="text-xs text-[#666666]">{proOrderQuerySum?.data?.sumCount}</span>
              </div>
              <div className="flex flex-col ml-4">
                <span className="text-xs text-[#999999]">獲得FireCoin</span>
                <span className="text-xs text-[#666666]">{proOrderQuerySum?.data?.sumToken}</span>
              </div>
            </div>
          )}
        </div>

        <Swiper
          direction="horizontal"
          loop
          indicator={() => null}
          ref={swiperRef}
          defaultIndex={activeIndex}
          onIndexChange={(index) => {
            setActiveIndex(index);
          }}
        >
          <Swiper.Item>
            <TradeCommissionHistory accountType={accountType} />
          </Swiper.Item>

          <Swiper.Item>
            <TradeLeverHistory
              ref={historyRef}
              accountType={accountType}
              symbol={symbol}
              orderState={orderState?.[0]}
            />
          </Swiper.Item>
        </Swiper>
      </Container>

      <Popup visible={visible} position="right">
        <div className="h-screen w-screen bg-white">
          <NavBar onBack={() => setVisible(false)}>選擇交易類型</NavBar>
          <List>
            {accountTypes.map((v) => (
              <List.Item
                arrow={null}
                key={v.value}
                onClick={() => {
                  setAccountType(v.value);
                  setVisible(false);
                }}
              >
                {v.label}
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>
    </Screen>
  );
};

const Container = styled.div`
  .adm-swiper {
    height: calc(100vh - 100px);
    min-height: 0;

    .adm-swiper-item {
      overflow-y: auto;
    }
  }
  .adm-list-body,
  .adm-tabs-header {
    border: 0;
  }

  .adm-tabs {
    --active-line-height: 0;
  }

  .adm-tabs-tab {
    color: #666175ae;
    --title-font-size: 14px;
    font-weight: bold;
  }

  .adm-tabs-tab-active {
    color: #4d4ce6;
    font-size: 18px;
  }
`;

export default TransactionRecords;
