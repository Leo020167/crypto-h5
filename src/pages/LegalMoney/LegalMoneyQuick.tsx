import { Button, Input } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as LegalHistory } from '../../assets/ic_svg_legal_history.svg';

import { ReactComponent as Transfer } from '../../assets/ic_svg_transfer.svg';
import LegalMore from './LegalMore';

const selectedClassNames = 'text-2xl font-bold text-white';
const unselectedClassNames = 'text-sm font-bold';

const LegalMoneyQuick = () => {
  const [status, setStatus] = useState<'buy' | 'sell'>('buy');

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 bg-[#6175AE] flex items-center px-5 text-[#CBCBCB] justify-between">
        <div>
          <a
            className={status === 'buy' ? selectedClassNames : unselectedClassNames}
            onClick={() => setStatus('buy')}
          >
            我要买
          </a>
          <a
            className={`ml-5 ${status === 'sell' ? selectedClassNames : unselectedClassNames}`}
            onClick={() => setStatus('sell')}
          >
            我要卖
          </a>
        </div>

        <div className="flex items-center">
          <Link to="/otc-order-history" className="w-10">
            <LegalHistory />
          </Link>

          <LegalMore />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center">
          <span className="text-base font-bold text-[#3D3A50] flex-1">购买数量</span>

          <Link to="/transfer-coin" className="px-2 py-1 flex items-center bg-[#f1f3ff] rounded">
            <Transfer className="w-4 h-4 mr-1" />
            <span className="text-xs text-[#3D3A50]">劃轉</span>
          </Link>

          <a className="px-2 py-1 flex items-center bg-[#f1f3ff] rounded ml-4">
            <span className="text-xs text-[#3D3A50]">CNY</span>
            <DownFill className=" w-3 h-3 mr-1 text-[#746f6f] ml-4" />
          </a>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center relative h-12">
          <Input
            type="number"
            placeholder="输入数量"
            className="text-xl font-bold border-b h-full"
          />
          <div className="absolute right-0 text-xs flex">
            <span className="mr-4 text-[#9A9A9A]">USDT</span>
            <div className="bg-[#9A9A9A] w-[1px]"></div>
            <a className="px-4 text-[#6175AE]">全部</a>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="text-[#9A9A9A] text-xs">
          价格约
          <span className="text-sm text-[#6175AE]">0.00</span>
          <span>HDK/USDT</span>
          <span className="mx-4">余额(USDT)</span>
        </div>

        <div className="mt-4 text-[#9A9A9A] text-xs">限额15000.00USDT-700000.00USDT</div>
      </div>

      <div className="px-4 mt-12">
        <Button block color="primary">
          0手续费购买
        </Button>
      </div>
    </div>
  );
};

export default LegalMoneyQuick;
