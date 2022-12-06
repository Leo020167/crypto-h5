import { Popover, Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useOtcGetCertificationInfo } from '../../api/endpoints/transformer';

import { ReactComponent as Authentication } from '../../assets/ic_svg_authentication.svg';
import { ReactComponent as LegalMoreSvg } from '../../assets/ic_svg_legal_more.svg';
import { ReactComponent as MyPublish } from '../../assets/ic_svg_my_publish.svg';
import { ReactComponent as ReceiptManager } from '../../assets/ic_svg_receipt_manager.svg';

const LegalMore = () => {
  const history = useHistory();

  const { data } = useOtcGetCertificationInfo();

  const intl = useIntl();

  return (
    <Popover.Menu
      actions={[
        {
          key: 'scan1',
          icon: <MyPublish className="h-5" />,
          text: intl.formatMessage({ defaultMessage: '我的廣告', id: '64eliW' }),
          onClick() {
            if (data?.data?.otcCertification) {
              history.push('/my-ad-list');
            } else {
              Toast.show(intl.formatMessage({ defaultMessage: '請先進行商家認證', id: 'IFXGBR' }));
            }
          },
        },
        {
          key: 'scan2',
          icon: <Authentication className="h-5" />,
          text: intl.formatMessage({ defaultMessage: '商家認證', id: 'O3jk1+' }),
          onClick() {
            history.push('/merchant-authentication');
          },
        },
        {
          key: 'scan3',
          icon: <ReceiptManager className="h-5" />,
          text: intl.formatMessage({ defaultMessage: '收款管理', id: 'WLF2E0' }),
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
