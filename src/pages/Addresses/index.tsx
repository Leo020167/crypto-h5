import { RightOutline } from 'antd-mobile-icons';
import Screen from '../../components/Screen';

const Addresses = () => {
  return (
    <Screen headerTitle="提幣地址管理">
      <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="text-[#3E4660] text-sm mb-4">我的提幣地址</div>

        <a className=" bg-white rounded-lg shadow-md shadow-black/5 px-5 py-4 flex items-center">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="text-[#6175AE] text-lg">BTC</div>
            <div className="text-[#A2A9BC] text-xs mt-1 break-words">
              0x8a449601e8f0920a0ccfdddec67ae5870f07c0fb
            </div>
            <div className="text-[#A2A9BC] mt-2">
              備注
              <span className="text-[#3E4660] ml-1">自己寫的備註USDT</span>
            </div>
          </div>
          <RightOutline fontSize={18} className=" ml-8" />
        </a>
      </div>
    </Screen>
  );
};

export default Addresses;
