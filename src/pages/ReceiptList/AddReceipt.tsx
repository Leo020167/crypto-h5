import { List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useQueryParam, StringParam } from 'use-query-params';
import { useOtcFindMyPaymentList } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';

const AddReceipt = () => {
  const history = useHistory();

  const [from] = useQueryParam('from', StringParam);

  const { data } = useOtcFindMyPaymentList({});

  const intl = useIntl();

  return (
    <Container headerTitle={intl.formatMessage({ defaultMessage: '添加賬戶類型', id: 'QInuMW' })}>
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
                history.push({
                  pathname: '/add-bank-pay',
                  search: stringify({ receiptType, from }),
                });
              } else {
                Toast.show(intl.formatMessage({ defaultMessage: '未知類型', id: 'cuM+vo' }));
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
