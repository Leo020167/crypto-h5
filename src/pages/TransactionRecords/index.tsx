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
import { DownOutline } from 'antd-mobile-icons';
import { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useProOrderQuerySum } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import TradeCommissionHistory from './TradeCommissionHistory';
import TradeLeverHistory, { TradeLeverHistoryRef } from './TradeLeverHistory';

interface AccountType {
  value: string;
  label: string;
}

const proOrderQuerySumKeys = ['stock', 'digital'];

const AccountTypeParam = withDefault(StringParam, 'spot');
const ActiveIndexParam = withDefault(NumberParam, 0);

const TransactionRecords = () => {
  const [visible, setVisible] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  const [symbol, setSymbol] = useState<string>();
  const [orderState, setOrderState] = useState<string[]>(['1']);

  const [accountType, setAccountType] = useQueryParam('accountType', AccountTypeParam);
  const [activeIndex, setActiveIndex] = useQueryParam('activeIndex', ActiveIndexParam);

  const intl = useIntl();

  const accountTypes: AccountType[] = useMemo(
    () => [
      {
        value: 'spot',
        label: intl.formatMessage({ defaultMessage: '幣幣交易記錄', id: 'RXCFfg' }),
      },
    ],
    [intl],
  );

  const tabItems = useMemo(
    () => [
      { key: '1', title: intl.formatMessage({ defaultMessage: '委托记录', id: '9wuU2o' }) },
      { key: '2', title: intl.formatMessage({ defaultMessage: '历史记录', id: 'zH7h1q' }) },
    ],
    [intl],
  );

  const accountTypeOption = useMemo(
    () => accountTypes.find((v) => v.value === accountType),
    [accountType, accountTypes],
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
        <a className="flex items-center justify-center text-base">{accountTypeOption?.label}</a>
      }
      navBarProps={{
        right: (
          <div className="flex justify-end">
            {activeIndex === 1 && (
              <Dropdown ref={ref} arrow={<DownOutline />}>
                <Dropdown.Item
                  key="sorter"
                  title={intl.formatMessage({ defaultMessage: '筛选', id: 'C8ZFaR' })}
                >
                  <div className="p-4">
                    <div className="flex flex-1 flex-col">
                      <div className="text-left text-base text-[#1D3155]">币种</div>
                      <Input
                        className="mt-2.5 h-10 rounded bg-[#f9fafd] pl-2.5"
                        placeholder={intl.formatMessage({
                          defaultMessage: '請輸入幣種',
                          id: '9ErIMe',
                        })}
                      />
                    </div>

                    <div className="mt-5 flex flex-1 flex-col">
                      <div className="text-left text-base text-[#1D3155]">订单状态</div>
                      <Selector
                        className="mb-8 mt-2.5"
                        columns={3}
                        showCheckMark={false}
                        options={[
                          {
                            label: intl.formatMessage({
                              defaultMessage: '已成交',
                              id: 'KLriKo',
                            }),
                            value: '1',
                          },
                          {
                            label: intl.formatMessage({
                              defaultMessage: '已撤销',
                              id: 'zznr09',
                            }),
                            value: '-1',
                          },
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
                          {intl.formatMessage({
                            defaultMessage: '重置',
                            id: 'r2dEd/',
                          })}
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
                          {intl.formatMessage({
                            defaultMessage: '确定',
                            id: 'r0/TUu',
                          })}
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
              setActiveIndex(index, 'replaceIn');
              swiperRef.current?.swipeTo(index);
            }}
          >
            {tabItems.map((item) => (
              <Tabs.Tab title={item.title} key={item.key} />
            ))}
          </Tabs>

          {proOrderQuerySumKeys.includes(accountType) && (
            <div className="flex flex-1 items-center justify-end px-4">
              <div className="flex flex-col">
                <span className="text-xs text-[#999999]">
                  {intl.formatMessage({
                    defaultMessage: '總交易手數',
                    id: 'EXoXnp',
                  })}
                </span>
                <span className="text-xs text-[#666666]">{proOrderQuerySum?.data?.sumCount}</span>
              </div>
              <div className="ml-4 flex flex-col">
                <span className="text-xs text-[#999999]">
                  {intl.formatMessage({
                    defaultMessage: '獲得FireCoin',
                    id: 'GKRXXt',
                  })}
                </span>
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
            setActiveIndex(index, 'replaceIn');
          }}
        >
          <Swiper.Item>
            {activeIndex === 0 && <TradeCommissionHistory accountType={accountType} />}
          </Swiper.Item>

          <Swiper.Item>
            {activeIndex === 1 && (
              <TradeLeverHistory
                key="trade-lever-history"
                ref={historyRef}
                accountType={accountType}
                symbol={symbol}
                orderState={orderState?.[0]}
              />
            )}
          </Swiper.Item>
        </Swiper>
      </Container>

      <Popup visible={visible} position="right">
        <div className="h-screen w-screen bg-white">
          <NavBar onBack={() => setVisible(false)}>
            {intl.formatMessage({
              defaultMessage: '選擇交易類型',
              id: 'bpymDW',
            })}
          </NavBar>
          <List>
            {accountTypes.map((v) => (
              <List.Item
                arrow={null}
                key={v.value}
                onClick={() => {
                  setAccountType(v.value, 'replaceIn');
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
    --title-font-size: 14px;
    color: #666175ae;
    font-weight: bold;
  }

  .adm-tabs-tab-active {
    color: #4d4ce6;
    font-size: 18px;
  }
`;

export default TransactionRecords;
