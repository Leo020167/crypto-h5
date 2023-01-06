import { ProgressBar, Tabs } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useGetSubscribeList } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';
import { stringDateFormat } from '../../utils/date';
import { useSubscribeState } from './useSubscribeState';

const TabParam = withDefault(StringParam, '0');

const SubscribeList = () => {
  const intl = useIntl();
  const [tab, setTab] = useQueryParam('tab', TabParam);

  const { data } = useGetSubscribeList();

  const items = useMemo(() => {
    if (data?.data?.length) {
      return data?.data.filter((v) => v.state === tab); // TODO
    }
    return [];
  }, [data?.data, tab]);

  const state = useSubscribeState();

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '新幣申購', id: 'I/5B/d' })}>
      <Container className="flex flex-col min-h-0">
        <Tabs activeKey={tab} onChange={(key) => setTab(key, 'replaceIn')}>
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '未開始', id: 'IudShd' })}
            key="0"
          />
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '進行中', id: '+JdgDW' })}
            key="1"
          />
          <Tabs.Tab
            title={intl.formatMessage({ defaultMessage: '已結束', id: 'IRtvek' })}
            key="2"
          />
        </Tabs>
        <div className="flex-1 overflow-y-auto">
          {items.map((v) => (
            <Link
              to={{ pathname: '/subscribe-detail', search: stringify({ id: v.id }) }}
              key={v.id}
              className="flex px-5 py-4 bg-[#FAFAFA]"
            >
              <div className=" w-16 h-16 mr-4">
                {!!v.image && <img alt="" src={v.image} className="w-full h-auto" />}
              </div>

              <div className="pb-4 flex-1">
                <div className="flex">
                  {!!v.summary && (
                    <span className="flex-1" dangerouslySetInnerHTML={{ __html: v.summary }}></span>
                  )}

                  <span
                    className="px-2 py-1  text-white rounded text-xs"
                    style={{ backgroundColor: state[v.state ?? '0'].color }}
                  >
                    {state[v.state ?? '0'].label}
                  </span>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    percent={Number(v.progress || 0)}
                    text
                    style={{
                      '--fill-color': state[v.state ?? '0'].color,
                    }}
                  />
                </div>

                <div className="mt-4 text-xs flex items-center">
                  <div>{intl.formatMessage({ defaultMessage: '發行量', id: 'mU805N' })}</div>
                  <div className="ml-1">
                    {v.sumAmount}&nbsp;
                    {v.symbol}
                  </div>
                </div>
                <div className="mt-2 text-xs flex items-center">
                  <div>{intl.formatMessage({ defaultMessage: '價格', id: 'qzi2dl' })}</div>
                  <div className="ml-1">
                    <span className=" font-bold text-red-500">{v.rate}</span>&nbsp; USDT
                  </div>
                </div>

                <div className="mt-2 text-xs">
                  <div>
                    {[
                      stringDateFormat(v.startTime, 'YYYY-MM-DD'),
                      stringDateFormat(v.endTime, 'YYYY-MM-DD'),
                    ]
                      .filter(Boolean)
                      .join(' ~ ')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-tabs {
    --title-font-size: 14px;
    --active-line-color: #5fce64;
    --active-title-color: #5fce64;
  }

  .adm-progress-bar {
    font-size: 12px;
    --track-width: 6px;
    --track-color: #ececec;
    --fill-color: #5fce64;
  }
`;

export default SubscribeList;
