import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ReactComponent as SvgTransfer } from '../../assets/ic_svg_transfer.svg';

const Transfer = () => {
  const intl = useIntl();
  return (
    <Link to="/transfer-coin" className="flex items-center rounded bg-[#f1f3ff] px-2 py-1">
      <SvgTransfer className="mr-1 h-4 w-4" />
      <span className="text-xs text-[#3D3A50]">
        {intl.formatMessage({ defaultMessage: '劃轉', id: 'QLilYb' })}
      </span>
    </Link>
  );
};

export default Transfer;
