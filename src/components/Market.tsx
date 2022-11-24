import { NavBar, Tabs } from 'antd-mobile';
import styled from 'styled-components';
import KLine from './KLine';

const Market = () => {
  return (
    <Container className="h-full min-h-0 text-white flex flex-col">
      <NavBar>恒生指数</NavBar>
      <div className="flex-1 overflow-y-auto bg-[#131e31]">
        <div className="flex items-center justify-between px-4">
          <div>
            <div>
              <span className="text-4xl font-bold">17650.72</span>
              <span className="text-[#c626073] ml-2">HKD</span>
            </div>

            <div className="mt-2 text-xs flex items-center gap-4">
              <span className="text-gray-400">0.00</span>
              <span className="text-gray-400">0.00</span>
              <span className="bg-[#6175ae] rounded-sm px-1 py-0.5 scale-[0.85]">已收盘</span>
            </div>
          </div>

          <div className="text-xs flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">高</span>
              <span className="text-white">17759.24</span>
            </div>
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">低</span>
              <span className="text-white">0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="w-8 text-gray-400">量</span>
              <span className="text-white">0.00</span>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" stretch={false} className="px-1.5">
          <Tabs.Tab title="分時" key="1" />
          <Tabs.Tab title="5分鐘" key="2" />
          <Tabs.Tab title="15分鐘" key="3" />
          <Tabs.Tab title="1小時" key="4" />
          <Tabs.Tab title="日K" key="5" />
          <Tabs.Tab title="周K" key="6" />
        </Tabs>
        <div className="px-4 py-1 bg-[#0F1826] flex text-xs gap-[2px]">
          <span className="scale-75 text-[#357dad]">MA5:</span>
          <span className="scale-75 text-[#ffc43e]">MA10:</span>
          <span className="scale-75 text-[#b080ce]">MA30:</span>
        </div>

        <div className="relative">
          <KLine />
          <div className="absolute z-10 top-[154px] text-xs w-full">
            <div className="flex items-center gap-2 ">
              <span className="text-[#01aa87]">VOL: </span>
              <span className="text-[#357dad]">MA5: </span>
              <span className="text-[#ffc43e]">MA10: </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#357dad]">2022-09-06</span>
              <span className="text-[#357dad]">2022-09-06</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <a>看涨</a>
        <a>看跌</a>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-nav-bar {
    border: 0;
    background-color: #131e31;
  }

  .adm-tabs {
    color: #626073;
    --adm-font-size-9: 14px;
    --adm-color-primary: #f08c42;

    .adm-tabs-header {
      border: 0;

      .adm-tabs-tab-wrapper {
        padding: 0 10px;
      }
    }
  }
`;

export default Market;
