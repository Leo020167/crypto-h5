import { List, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useOtcFindMyPaymentList } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';

const AddReceipt = () => {
  const navigate = useNavigate();

  const { data } = useOtcFindMyPaymentList({});

  return (
    <Container headerTitle="添加賬戶類型">
      <List>
        {data?.data?.myPaymentList?.map((v, i) => (
          <List.Item
            prefix={<img alt="" src={v.receiptLogo} className="w-5 h-5" />}
            key={i}
            onClick={() => {
              if (v.receiptType === '1' || v.receiptType === '2') {
                // TODO AddAliPayAndWechatPayActivity
              } else if (v.receiptType === '3') {
                navigate('/add-bank-pay');
              } else {
                Toast.show('未知類型');
              }
            }}
          >
            {v.receiptTypeValue}
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

const Container = styled(Screen)`
  .adm-list-body,
  .adm-list-item-content {
    border: 0;
  }
`;

export default AddReceipt;
