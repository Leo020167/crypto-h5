import { Tabs } from 'antd-mobile';

const Capability = () => {
  return (
    <div className="mt-4 px-5 bg-white flex flex-col">
      <Tabs stretch={false}>
        <Tabs.Tab title="水果" key="fruits">
          盈利能力
        </Tabs.Tab>
        <Tabs.Tab title="蔬菜" key="vegetables">
          跟單人氣
        </Tabs.Tab>
        <Tabs.Tab title="动物" key="animals">
          交易次數
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default Capability;
