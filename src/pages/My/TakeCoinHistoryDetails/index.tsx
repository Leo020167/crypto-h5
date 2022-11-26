import { List, NavBar } from 'antd-mobile';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DepositListResponseAllOfDataAllOfDataItem } from '../../../api/model';
import { stringDateFormat } from '../../../utils/date';

const TakeCoinHistoryDetails = () => {
  const history = useHistory();

  const location = useLocation();
  console.log(location);
  const state: DepositListResponseAllOfDataAllOfDataItem | undefined = location.state as any;

  return (
    <Container className="h-screen bg-white">
      <NavBar onBack={() => history.goBack()} className="bg-white">
        详情
      </NavBar>

      <List className="mt-8">
        <List.Item title="提币数量" extra={<span className="text-black">{state?.amount}</span>} />
        <List.Item
          title={state?.inOut === '1' ? '充币' : '提币'}
          extra={<span className="text-black">{state?.fee ?? '--'}</span>}
        />
        <List.Item title="提币地址" extra={<span className="text-black"></span>} />
        <List.Item title="状态" extra={<span className="text-black">{state?.stateDesc}</span>} />
        <List.Item
          title="时间"
          extra={<span className="text-black">{stringDateFormat(state?.createTime)}</span>}
        />
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
