import { Button, NavBar } from 'antd-mobile';
import { Link, useNavigate } from 'react-router-dom';

const RechargeCoin = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-white relative">
      <NavBar
        onBack={() => navigate(-1)}
        className="mb-4"
        right={<Link to="/recharge-coin-history">记录</Link>}
      >
        充币
      </NavBar>

      <div className="px-4">
        <div className="bg-[#f8faf9] h-14 text-[#989a99] text-lg px-4 flex items-center rounded">
          USDT
        </div>
        <div className="mt-4">
          <div className="text-[#1D3155]">充值网络</div>
          <div className="flex justify-between mt-2">
            <div className="py-2 px-1.5 border-2 text-xs flex items-center rounded border-[#727fa0] text-[#727fa0]">
              USDT-trc20
            </div>
            <div className="py-2 px-1.5 border-2 text-xs flex items-center rounded border-[#919191] text-[#919191]">
              USDT-erc20
            </div>
            <div className="py-2 px-1.5 border-2 text-xs flex items-center rounded border-[#919191] text-[#919191]">
              USDT-omni
            </div>
          </div>
        </div>

        <div className="mt-4 bg-[#f7f8fa] flex flex-col items-center justify-center p-5">
          <div className="px-4 py-1 rounded bg-[#e4e5e9] text-[#6175AE] mt-28">保存二维码</div>
          <div className="mt-5 w-full flex text-[#666175AE]">充币地址</div>
          <div className="mt-5 w-full flex">
            <div className="px-4 py-1 rounded bg-[#e4e5e9] text-[#6175AE]">复制</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <Button size="large" color="primary" block className="rounded-none">
          充值
        </Button>
      </div>
    </div>
  );
};

export default RechargeCoin;
