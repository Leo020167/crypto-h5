import { useMemo } from 'react';
import { ProOrderQueryListResponseAllOfDataAllOfDataItem } from '../../api/model';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { getOriginSymbol } from './utils';

interface SpotProps {
  data: ProOrderQueryListResponseAllOfDataAllOfDataItem;
}
const Spot = ({ data }: SpotProps) => {
  const buySell = useMemo(() => {
    if (data.buySell) {
      if (data.buySell === 'buy' || data.buySell === '买入') {
        return <span className="text-[#14CC4B]">买入</span>;
      } else {
        return <span className="text-[#CC1414]">卖出</span>;
      }
    }
    return <span></span>;
  }, [data.buySell]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-[#3D3A50] font-bold text-base">{getOriginSymbol(data.symbol)}</span>
          <span className="pl-2.5 text-[#663D3A50] text-xs">{buySell}</span>
          <span className="pl-2.5 text-[#661D3155] text-xs">{`手续费${data.fee}`}</span>
        </div>
        <div className="flex items-center text-[#663D3A50]">
          <span className=" ml-1 mr-2">已撤销</span>
          <Arrow />
        </div>
      </div>
      <div className="mt-2 flex">
        <div className="flex-[1.2] flex flex-col">
          <span className="text-xs text-[#663D3A50]">手数</span>
          <span className="text-[#3D3A50] mt-1">手数</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-xs text-[#663D3A50]">委託價</span>
          <span className="text-[#3D3A50] mt-1">手数</span>
        </div>
        <div className="flex-1 flex flex-col items-end">
          <span className="text-xs text-[#663D3A50]">開倉保證金</span>
          <span className="text-[#3D3A50] mt-1">手数</span>
        </div>
      </div>
    </div>
  );
};

export default Spot;
