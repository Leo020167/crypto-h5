import { List, Popup } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useOtcFindMyPaymentList } from '../../api/endpoints/transformer';
import { Receipt } from '../../api/model';

import ic_add2 from '../../assets/ic_add2.png';

interface LegalQuickSellDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (receipt: Receipt) => void;
}

const LegalQuickSellDialog = ({ open, onClose, onSelect }: LegalQuickSellDialogProps) => {
  const { data } = useOtcFindMyPaymentList({
    query: {
      enabled: open,
    },
  });

  const history = useHistory();

  const intl = useIntl();

  return (
    <Container visible={open} onClose={onClose} closeOnMaskClick>
      <div className="flex flex-col">
        <span className="flex h-16 items-center px-4 text-base font-bold text-[#3D3A50]">
          {intl.formatMessage({ defaultMessage: '收款方式', id: 'UA7E9h' })}
        </span>
        <List className="mb-4">
          {data?.data?.myPaymentList?.map((v, i) => (
            <List.Item
              prefix={<img alt="" src={v.receiptLogo} className="h-5 w-5" />}
              key={i}
              arrow={null}
              onClick={() => onSelect(v)}
            >
              {v.receiptTypeValue}
            </List.Item>
          ))}

          {(data?.data?.myPaymentList?.length ?? 0) < 3 && (
            <List.Item
              prefix={<img alt="" src={ic_add2} className="h-5 w-5" />}
              key="add"
              onClick={() => {
                history.push('/add-receipt');
              }}
            >
              {intl.formatMessage({ defaultMessage: '新增收款方式', id: '0vuz1g' })}
            </List.Item>
          )}
        </List>
      </div>
    </Container>
  );
};

const Container = styled(Popup)`
  .adm-list-body,
  .adm-list-item-content {
    border: 0;
  }
`;

export default LegalQuickSellDialog;
