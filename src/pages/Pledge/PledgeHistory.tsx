import { ErrorBlock, Tabs } from 'antd-mobile';
import { useState } from 'react';
import styled from 'styled-components';
import { useRecordListPledges } from '../../api/endpoints/transformer';
import { PledgeRecord } from '../../api/model';
import pledge_history_empty_png from '../../assets/pledge-history-empty.png';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';

const PledgeHistory = () => {
  const [activeKey, setActiveKey] = useState('0');

  const { data } = useRecordListPledges({
    status: activeKey,
  });

  return (
    <Screen headerTitle="质押记录">
      <Container className="flex-1 flex flex-col min-h-0">
        <Tabs
          stretch={false}
          activeKey={activeKey}
          onChange={setActiveKey}
          className="flex-1 flex flex-col min-h-0"
        >
          <Tabs.Tab title="進行中" key="0">
            <PledgeRecords records={data?.data} />
          </Tabs.Tab>
          <Tabs.Tab title="已結束" key="1">
            <PledgeRecords records={data?.data} />
          </Tabs.Tab>
        </Tabs>
      </Container>
    </Screen>
  );
};

const PledgeRecords = ({ records = [] }: { records?: PledgeRecord[] }) => {
  if (records.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorBlock image={pledge_history_empty_png} title="暫無數據" description="" />
      </div>
    );
  }

  return (
    <>
      {records.map((v) => (
        <div
          key={v.id}
          className="bg-white h-40 rounded-lg shadow-md shadow-black/5 border-l-2 border-[#0BBB79] py-4 px-5 mb-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[#3E4660] text-lg">{v.symbol}</span>
            <div className="bg-[#6175AE] text-white text-sm pl-3 pr-2 py-0.5 rounded-tl-lg rounded-bl-lg -mr-5">
              {v.duration}天
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[#A2A9BC] text-xs">纍計收益</span>
              <span className="text-[#6175AE] text-xl">{v.preProfit}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#A2A9BC] text-xs">質押數量</span>
              <span className="text-[#6175AE] text-xl">{v.count}</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC]">質押開始時間</span>
            <span className="text-[#6175AE]">{stringDateFormat(v.startTime)}</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC]">質押開始時間</span>
            <span className="text-[#6175AE]">{stringDateFormat(v.endTime)}</span>
          </div>
        </div>
      ))}
    </>
  );
};

const Container = styled.div`
  .adm-tabs {
    --title-font-size: 16px;
    --active-line-color: #4d4bda;
    --active-title-color: #4d4bda;

    .adm-tabs-header {
      border: 0;
    }

    .adm-tabs-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background-color: #f4f6f4;
      padding: 16px;
    }

    .adm-error-block-description-title {
      font-size: 14px;
      color: #666;
    }
  }
`;

export default PledgeHistory;
