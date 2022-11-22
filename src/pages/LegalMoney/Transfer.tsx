import { Link } from 'react-router-dom';
import { ReactComponent as SvgTransfer } from '../../assets/ic_svg_transfer.svg';

const Transfer = () => {
  return (
    <Link to="/transfer-coin" className="px-2 py-1 flex items-center bg-[#f1f3ff] rounded">
      <SvgTransfer className="w-4 h-4 mr-1" />
      <span className="text-xs text-[#3D3A50]">劃轉</span>
    </Link>
  );
};

export default Transfer;
