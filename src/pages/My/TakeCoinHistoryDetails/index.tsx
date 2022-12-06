import { List, NavBar } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DepositListResponseAllOfDataAllOfDataItem } from '../../../api/model';
import { stringDateFormat } from '../../../utils/date';

const TakeCoinHistoryDetails = () => {
  const history = useHistory();

  const location = useLocation();

  const state: DepositListResponseAllOfDataAllOfDataItem | undefined = location.state as any;

  const intl = useIntl();

  return (
    <Container className="h-screen bg-white">
      <NavBar onBack={() => history.goBack()} className="bg-white">
        {intl.formatMessage({ defaultMessage: '详情', id: 's4hJju' })}
      </NavBar>

      <List className="mt-8">
        <List.Item
          title={intl.formatMessage({ defaultMessage: '提幣數量', id: 'wbTfN9' })}
          extra={<span className="text-black">{state?.amount}</span>}
        />
        <List.Item
          title={
            state?.inOut === '1'
              ? intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })
              : intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })
          }
          extra={<span className="text-black">{state?.fee ?? '--'}</span>}
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '提幣地址', id: 'NUeill' })}
          extra={<span className="text-black"></span>}
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
          extra={<span className="text-black">{state?.stateDesc}</span>}
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
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
