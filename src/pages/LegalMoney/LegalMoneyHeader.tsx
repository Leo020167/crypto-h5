import { Badge } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useGetUnreadCount } from '../../api/endpoints/transformer';
import { ReactComponent as LegalHistory } from '../../assets/ic_svg_legal_history.svg';
import LegalMore from './LegalMore';
const selectedClassNames = 'text-2xl font-bold text-white';
const unselectedClassNames = 'text-sm font-bold';

interface LegalMoneyHeaderProps {
  value?: string;
  onChange: (value: 'buy' | 'sell') => void;
}

const LegalMoneyHeader = ({ value, onChange }: LegalMoneyHeaderProps) => {
  const { data } = useGetUnreadCount();

  const intl = useIntl();
  return (
    <div className="flex h-16 items-center justify-between bg-[#6175AE] px-5 text-[#CBCBCB]">
      <div>
        <a
          className={value === 'buy' ? selectedClassNames : unselectedClassNames}
          onClick={() => onChange('buy')}
        >
          {intl.formatMessage({ defaultMessage: '我要买', id: 'cx0QNu' })}
        </a>
        <a
          className={`ml-5 ${value === 'sell' ? selectedClassNames : unselectedClassNames}`}
          onClick={() => onChange('sell')}
        >
          {intl.formatMessage({ defaultMessage: '我要卖', id: 'LEah6f' })}
        </a>
      </div>

      <div className="flex items-center">
        <Link to="/otc-order-history" className="flex w-10 items-center">
          <Badge content={Number(data?.data?.otcCount) || null}>
            <LegalHistory />
          </Badge>
        </Link>

        <LegalMore />
      </div>
    </div>
  );
};

export default LegalMoneyHeader;
