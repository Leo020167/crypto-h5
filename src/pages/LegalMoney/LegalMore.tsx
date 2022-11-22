import { Popover } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Authentication } from '../../assets/ic_svg_authentication.svg';
import { ReactComponent as LegalMoreSvg } from '../../assets/ic_svg_legal_more.svg';
import { ReactComponent as MyPublish } from '../../assets/ic_svg_my_publish.svg';
import { ReactComponent as ReceiptManager } from '../../assets/ic_svg_receipt_manager.svg';

const LegalMore = () => {
  const history = useHistory();
  return (
    <Popover.Menu
      actions={[
        { key: 'scan1', icon: <MyPublish className="h-5" />, text: '我的廣告' },
        { key: 'scan2', icon: <Authentication className="h-5" />, text: '商家确认' },
        {
          key: 'scan3',
          icon: <ReceiptManager className="h-5" />,
          text: '收款管理',
          onClick() {
            history.push('/receipt-list');
          },
        },
      ]}
      placement="bottom-start"
      trigger="click"
    >
      <a className="w-10">
        <LegalMoreSvg />
      </a>
    </Popover.Menu>
  );
};

export default LegalMore;
