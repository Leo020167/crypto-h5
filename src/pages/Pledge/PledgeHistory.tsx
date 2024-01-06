import { ErrorBlock, SpinLoading, Tabs } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRecordListPledges } from '../../api/endpoints/transformer';
import { PledgeRecord } from '../../api/model';
import pledge_history_empty_png from '../../assets/pledge-history-empty.png';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';

const PledgeHistory = () => {
  const [activeKey, setActiveKey] = useState('0');

  const { data, isLoading } = useRecordListPledges({
    status: activeKey,
  });

  const intl = useIntl();

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <SpinLoading color="primary" />
        </div>
      );
    }
    return <PledgeRecords records={data?.data} />;
  }, [data?.data, isLoading]);
  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '质押记录', id: 'lfsX8H' })}>
      <div className="pledge-history flex min-h-0 flex-1 flex-col">
        <Tabs
          stretch={false}
          activeKey={activeKey}
          onChange={setActiveKey}
          className="flex min-h-0 flex-1 flex-col"
        >
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '進行中', id: '+JdgDW' })} key="0">
            {content}
          </Tabs.Tab>
          <Tabs.Tab title={intl.formatMessage({ defaultMessage: '已結束', id: 'IRtvek' })} key="1">
            {content}
          </Tabs.Tab>
        </Tabs>
      </div>
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
          className="mb-4 h-40 rounded-lg border-l-2 border-[#0BBB79] bg-white px-5 py-4 shadow-md shadow-black/5 dark:bg-[#2A2E38]"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg text-[#3E4660] dark:text-white">{v.symbol}</span>
            <div className="-mr-5 rounded-bl-lg rounded-tl-lg bg-[#6175AE] py-0.5 pl-3 pr-2 text-sm text-white dark:bg-[#0BBB79]">
              {v.duration}
              {intl.formatMessage({ defaultMessage: '天', id: '0B0jPm' })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
                {intl.formatMessage({ defaultMessage: '纍計收益', id: 'fzPv+C' })}
              </span>
              <span className="text-xl text-[#6175AE] dark:text-white">{v.profit}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
                {intl.formatMessage({ defaultMessage: '質押數量', id: 'mjDNUB' })}
              </span>
              <span className="text-xl text-[#6175AE] dark:text-white">{v.count}</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC] dark:text-[#AAAAAA]">
              {intl.formatMessage({ defaultMessage: '質押開始時間', id: 'Ma2fRl' })}
            </span>
            <span className="text-[#6175AE] dark:text-white">{stringDateFormat(v.startTime)}</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC] dark:text-[#AAAAAA]">
              {intl.formatMessage({ defaultMessage: '質押結束時間', id: 'J1sdOC' })}
            </span>
            <span className="text-[#6175AE] dark:text-white">{stringDateFormat(v.endTime)}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default PledgeHistory;
