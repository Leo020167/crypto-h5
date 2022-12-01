import { Selector, Tabs } from 'antd-mobile';
import styled from 'styled-components';
import { UserRadar } from '../../api/model';

const Capability = ({ radar }: { radar?: UserRadar }) => {
  return (
    <Container className="mt-4 px-4 bg-white flex flex-col">
      <Tabs stretch={false}>
        <Tabs.Tab title="盈利能力" key="1">
          <Selector
            options={[
              {
                label: '一個月',
                value: '1',
              },
              {
                label: '三個月',
                value: '2',
              },
              {
                label: '六個月',
                value: '3',
              },
              {
                label: '一年内',
                value: '4',
              },
            ]}
            showCheckMark={false}
          />
        </Tabs.Tab>
        <Tabs.Tab title="跟單人氣" key="2">
          跟單人氣
        </Tabs.Tab>
        <Tabs.Tab title="交易次數" key="3">
          交易次數
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};

const Container = styled.div`
  .adm-selector {
    --padding: 4px 12px;
    font-size: 12px;
    .adm-selector-item {
      background: transparent;
      border-radius: 14px;
      color: #666175ae;
      &.adm-selector-item-active {
        color: #6175ae;
        background-color: #f0f1f5;
      }
    }

    .adm-space.adm-space {
      --gap: 6px;
    }
  }

  .adm-tabs {
    color: #666175ae;
    --title-font-size: 16px;
    --active-title-color: #4d4ce6;
    --active-line-height: 3px;

    .adm-tabs-header {
      border: 0;
    }
    .adm-tabs-content {
      padding: 12px 0;
    }
  }
`;

export default Capability;
