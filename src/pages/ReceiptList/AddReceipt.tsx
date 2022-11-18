import { List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Screen from '../../components/Screen';

const AddReceipt = () => {
  const navigate = useNavigate();
  return (
    <Container headerTitle="添加賬戶類型">
      <List>
        <List.Item arrow={null} onClick={() => navigate('/add-bank-pay')}>
          银行卡
        </List.Item>
      </List>
    </Container>
  );
};

const Container = styled(Screen)`
  .adm-list-body {
    border: 0;
  }
`;

export default AddReceipt;
