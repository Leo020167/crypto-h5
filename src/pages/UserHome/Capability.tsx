import { Selector, Tabs } from 'antd-mobile';
import { graphic } from 'echarts/core';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { usePersonalTrendChart } from '../../api/endpoints/transformer';
import { UserRadar } from '../../api/model';
import useECharts from '../../hooks/useECharts';

const Capability = ({ radar }: { radar?: UserRadar }) => {
  const [timeType, setTimeType] = useState<string>('month');
  const [type, setType] = useState<string>('1');
  const { data } = usePersonalTrendChart(
    {
      targetUid: radar?.userId ?? '',
      timeType: timeType,
      type,
    },
    {
      query: {
        enabled: !!radar?.userId,
      },
    },
  );

  const ref = useRef<HTMLDivElement>(null);
  useECharts(ref, {
    animation: false,
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data?.data?.trendData?.map((v) => v.dayTimeFor) ?? [],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Line 5',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(156, 165, 196)',
            },
            {
              offset: 1,
              color: 'rgb(156, 165, 196)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: data?.data?.trendData?.map((v) => Number(v.num)) ?? [],
      },
    ],
  });

  const intl = useIntl();

  return (
    <Container className="mt-4 flex flex-col bg-white px-4">
      <Tabs
        stretch={false}
        activeKey={type}
        onChange={(key) => {
          setType(key);
          setTimeType('month');
        }}
      >
        <Tabs.Tab title="盈利能力" key="1">
          <Selector
            value={[timeType]}
            onChange={(value) => {
              if (value.length) {
                setTimeType(value[0]);
              }
            }}
            options={[
              {
                label: intl.formatMessage({ defaultMessage: '一個月', id: '+sZUWv' }),
                value: 'month',
              },
              {
                label: intl.formatMessage({ defaultMessage: '三個月', id: 'UgHO9l' }),
                value: 'month3',
              },
              {
                label: intl.formatMessage({ defaultMessage: '六個月', id: 'mCDkHz' }),
                value: 'month6',
              },
              {
                label: intl.formatMessage({ defaultMessage: '一年内', id: 'HMxoED' }),
                value: 'year',
              },
            ]}
            showCheckMark={false}
          />
        </Tabs.Tab>
        <Tabs.Tab title={intl.formatMessage({ defaultMessage: '跟單人氣', id: 'P8YUAQ' })} key="2">
          <Selector
            value={[timeType]}
            onChange={(value) => {
              if (value.length) {
                setTimeType(value[0]);
              }
            }}
            options={[
              {
                label: intl.formatMessage({ defaultMessage: '一個月', id: '+sZUWv' }),
                value: 'month',
              },
              {
                label: intl.formatMessage({ defaultMessage: '三個月', id: 'UgHO9l' }),
                value: 'month3',
              },
              {
                label: intl.formatMessage({ defaultMessage: '六個月', id: 'mCDkHz' }),
                value: 'month6',
              },
              {
                label: intl.formatMessage({ defaultMessage: '一年内', id: 'HMxoED' }),
                value: 'year',
              },
            ]}
            showCheckMark={false}
          />
        </Tabs.Tab>
        <Tabs.Tab title={intl.formatMessage({ defaultMessage: '交易次數', id: 'XNQjr/' })} key="3">
          <Selector
            value={[timeType]}
            onChange={(value) => {
              if (value.length) {
                setTimeType(value[0]);
              }
            }}
            options={[
              {
                label: intl.formatMessage({ defaultMessage: '一個月', id: '+sZUWv' }),
                value: 'month',
              },
              {
                label: intl.formatMessage({ defaultMessage: '三個月', id: 'UgHO9l' }),
                value: 'month3',
              },
              {
                label: intl.formatMessage({ defaultMessage: '六個月', id: 'mCDkHz' }),
                value: 'month6',
              },
              {
                label: intl.formatMessage({ defaultMessage: '一年内', id: 'HMxoED' }),
                value: 'year',
              },
            ]}
            showCheckMark={false}
          />
        </Tabs.Tab>
      </Tabs>

      <div className="mb-4">
        <div className=" h-52" ref={ref}></div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-selector {
    --padding: 4px 12px;
    font-size: 12px;
    .adm-selector-item {
      border-radius: 14px;
      background: transparent;
      color: #666175ae;
      &.adm-selector-item-active {
        background-color: #f0f1f5;
        color: #6175ae;
      }
    }

    .adm-space.adm-space {
      --gap: 6px;
    }
  }

  .adm-tabs {
    --title-font-size: 16px;
    --active-title-color: #4d4ce6;
    --active-line-height: 3px;
    color: #666175ae;

    .adm-tabs-header {
      border: 0;
    }
    .adm-tabs-content {
      padding: 12px 0;
    }
  }
`;

export default Capability;
