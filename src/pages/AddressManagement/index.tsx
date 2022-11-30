import { AddOutline } from 'antd-mobile-icons';
import { Link } from 'react-router-dom';
import { ReactComponent as SvgTrash } from '../../assets/trash.svg';
import Screen from '../../components/Screen';

const AddressManagement = () => {
  return (
    <Screen
      headerTitle="提幣地址管理"
      right={
        <div className="flex justify-end">
          <Link to="/address-management/add">
            <AddOutline fontSize={24} color="#333" />
          </Link>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="text-[#3E4660] text-sm mb-4">我的提幣地址</div>

        <a className=" bg-white rounded-lg shadow-md shadow-black/5 px-5 py-4 flex items-center">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="text-[#6175AE] text-lg flex items-center justify-between">
              <span>BTC</span>
              <SvgTrash />
            </div>

            <div className="text-[#A2A9BC] text-xs mt-1 break-words">
              0x8a449601e8f0920a0ccfdddec67ae5870f07c0fb
            </div>

            <div className="text-[#A2A9BC] mt-2">
              備注
              <span className="text-[#3E4660] ml-1">自己寫的備註USDT</span>
            </div>
          </div>
        </a>
      </div>
    </Screen>
  );
};

export default AddressManagement;
