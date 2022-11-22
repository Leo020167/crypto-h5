import { List, Toast } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useOtcFindMyPaymentList } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';

const AddReceipt = () => {
  const history = useHistory();

  const { data } = useOtcFindMyPaymentList({});

  return (
    <Container headerTitle="添加賬戶類型">
      <List>
        {data?.data?.myPaymentList?.map((v, i) => (
          <List.Item
            prefix={<img alt="" src={v.receiptLogo} className="w-5 h-5" />}
            key={i}
            onClick={() => {
              const receiptType = Number(v.receiptType);
              if (receiptType === 1 || receiptType === 2) {
                // TODO AddAliPayAndWechatPayActivity
              } else if (receiptType === 3) {
                history.push('/add-bank-pay');
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
