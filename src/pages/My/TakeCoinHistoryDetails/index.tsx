import { List, NavBar } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DepositWithdrawListItem } from '../../../api/model';
import { stringDateFormat } from '../../../utils/date';

const TakeCoinHistoryDetails = () => {
  const history = useHistory();

  const location = useLocation();

  const state: DepositWithdrawListItem | undefined = location.state as any;

  const intl = useIntl();

  return (
    <Container className="h-screen bg-white dark:bg-[#161720]">
      <NavBar onBack={() => history.goBack()} className="bg-white dark:bg-[#161720]">
        {intl.formatMessage({ defaultMessage: '详情', id: 's4hJju' })}
      </NavBar>

      <List>
        <List.Item
          title={
            state?.inOut === '1'
              ? intl.formatMessage({ defaultMessage: '充幣数量', id: '2+V/xG' })
              : intl.formatMessage({ defaultMessage: '提幣數量', id: 'wbTfN9' })
          }
          extra={
            <span className="text-black dark:text-white">
              {state?.amount}
              {state?.symbol}
            </span>
          }
        />

        <List.Item
          title={intl.formatMessage({ defaultMessage: '手续费', id: 'XdbxuW' })}
          extra={
            <span className="text-black dark:text-white">
              {state?.fee ?? '--'}
              {state?.symbol}
            </span>
          }
        />
        <List.Item
          title={
            state?.inOut === '1'
              ? intl.formatMessage({ defaultMessage: '充幣地址', id: 'Q4foHv' })
              : intl.formatMessage({ defaultMessage: '提幣地址', id: 'NUeill' })
          }
          extra={
            <div className="overflow-x-auto text-black dark:text-white">
              {state?.address ?? '-'}
            </div>
          }
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
          extra={<span className="text-black dark:text-white">{state?.stateDesc}</span>}
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '時間', id: 'W6smHj' })}
          extra={
            <span className="text-black dark:text-white">
              {stringDateFormat(state?.createTime)}
            </span>
          }
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
