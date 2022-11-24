import { List, Popup } from 'antd-mobile';
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

  return (
    <Container visible={open} onClose={onClose} closeOnMaskClick>
      <div className="flex flex-col">
        <span className="h-16 flex items-center px-4 text-base font-bold text-[#3D3A50]">
          收款方式
        </span>
        <List className="mb-4">
          {data?.data?.myPaymentList?.map((v, i) => (
            <List.Item
              prefix={<img alt="" src={v.receiptLogo} className="w-5 h-5" />}
              key={i}
              arrow={null}
              onClick={() => onSelect(v)}
            >
              {v.receiptTypeValue}
            </List.Item>
          ))}

          {(data?.data?.myPaymentList?.length ?? 0) < 3 && (
            <List.Item
              prefix={<img alt="" src={ic_add2} className="w-5 h-5" />}
              key="add"
              onClick={() => {
                history.push('/add-receipt');
              }}
            >
              新增收款方式
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