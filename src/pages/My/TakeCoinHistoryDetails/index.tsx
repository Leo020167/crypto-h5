import { List, NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TakeCoinHistoryDetails = () => {
  const navigate = useNavigate();
  return (
    <Container className="h-screen bg-white">
      <NavBar onBack={() => navigate(-1)} className="bg-white">
        详情
      </NavBar>

      <List className="mt-8">
        <List.Item title="提币数量" extra={<span className="text-black">1</span>} />
        <List.Item title="提币" extra={<span className="text-black">1</span>} />
        <List.Item title="提币地址" extra={<span className="text-black">1</span>} />
        <List.Item title="状态" extra={<span className="text-black">1</span>} />
        <List.Item title="时间" extra={<span className="text-black">1</span>} />
      </List>
    </Container>
  );
};

const Container = styled.div`
  .adm-list-body {
    border-top: 0;
  }
`;

export default TakeCoinHistoryDetails;
