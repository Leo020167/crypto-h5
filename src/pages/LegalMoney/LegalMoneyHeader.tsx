import { Link } from 'react-router-dom';
import { ReactComponent as LegalHistory } from '../../assets/ic_svg_legal_history.svg';
import LegalMore from './LegalMore';
const selectedClassNames = 'text-2xl font-bold text-white';
const unselectedClassNames = 'text-sm font-bold';

interface LegalMoneyHeaderProps {
  value?: string;
  onChange: (value: 'buy' | 'sell') => void;
}

const LegalMoneyHeader = ({ value, onChange }: LegalMoneyHeaderProps) => {
  return (
    <div className="h-16 bg-[#6175AE] flex items-center px-5 text-[#CBCBCB] justify-between">
      <div>
        <a
          className={value === 'buy' ? selectedClassNames : unselectedClassNames}
          onClick={() => onChange('buy')}
        >
          我要买
        </a>
        <a
          className={`ml-5 ${value === 'sell' ? selectedClassNames : unselectedClassNames}`}
          onClick={() => onChange('sell')}
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
  );
};

export default LegalMoneyHeader;
