import { ErrorBlock, Tabs } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
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

  const intl = useIntl();
  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '质押记录', id: 'lfsX8H' })}>
      <Container className="flex min-h-0 flex-1 flex-col">
        <Tabs
          stretch={false}
          activeKey={activeKey}
          onChange={setActiveKey}
          className="flex min-h-0 flex-1 flex-col"
        >
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '進行中', id: '+JdgDW' })} key="0">
            <PledgeRecords records={data?.data} />
          </Tabs.Tab>
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '已結束', id: 'IRtvek' })} key="1">
            <PledgeRecords records={data?.data} />
          </Tabs.Tab>
        </Tabs>
      </Container>
    </Screen>
  );
};

const PledgeRecords = ({ records = [] }: { records?: PledgeRecord[] }) => {
  const intl = useIntl();

  if (records.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorBlock
          image={pledge_history_empty_png}
          title={intl.formatMessage({ defaultMessage: '暫無數據', id: 'dqhJYx' })}
          description=""
        />
      </div>
    );
  }

  return (
    <>
      {records.map((v) => (
        <div
          key={v.id}
          className="mb-4 h-40 rounded-lg border-l-2 border-[#0BBB79] bg-white px-5 py-4 shadow-md shadow-black/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg text-[#3E4660]">{v.symbol}</span>
            <div className="-mr-5 rounded-bl-lg rounded-tl-lg bg-[#6175AE] py-0.5 pl-3 pr-2 text-sm text-white">
              {v.duration}
              {intl.formatMessage({ defaultMessage: '天', id: '0B0jPm' })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#A2A9BC]">
                {intl.formatMessage({ defaultMessage: '纍計收益', id: 'fzPv+C' })}
              </span>
              <span className="text-xl text-[#6175AE]">{v.profit}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-[#A2A9BC]">
                {intl.formatMessage({ defaultMessage: '質押數量', id: 'mjDNUB' })}
              </span>
              <span className="text-xl text-[#6175AE]">{v.count}</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC]">
              {intl.formatMessage({ defaultMessage: '質押開始時間', id: 'Ma2fRl' })}
            </span>
            <span className="text-[#6175AE]">{stringDateFormat(v.startTime)}</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC]">
              {intl.formatMessage({ defaultMessage: '質押結束時間', id: 'J1sdOC' })}
            </span>
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
      display: flex;
      flex: 1;
      flex-direction: column;
      background-color: #f4f6f4;
      padding: 16px;
      overflow-y: auto;
    }

    .adm-error-block-description-title {
      color: #666;
      font-size: 14px;
    }
  }
`;

export default PledgeHistory;
