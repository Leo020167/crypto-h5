import { Button, List } from 'antd-mobile';
import styled from 'styled-components';
import { useGetCertificationInfo } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';

/**
 * 商家認證
 * @returns
 */
const MerchantAuthentication = () => {
  const { data } = useGetCertificationInfo();

  const otcCertification = data?.data?.otcCertification;
  const isAuthentication = otcCertification?.idCertify === '1';

  return (
    <Screen headerTitle="商家認證">
      <Container className="px-4">
        <div className=" h-16 flex items-center">
          <span className="flex-1 text-base text-[#1A1717] font-bold">實名信息</span>
          <span className="text-[#6175AE]">{isAuthentication ? '已實名' : '未實名'}</span>
        </div>
        <List>
          <List.Item title="姓名" extra={otcCertification?.realName ?? '--'} />
          <List.Item title="證件號碼" extra={otcCertification?.certNo ?? '--'} />
          <List.Item
            title="保證金"
            className="border-b border-[#eeeeee]"
            extra={otcCertification?.securityDeposit + ' USDT'}
          />
        </List>
        <div className="text-[#9A9A9A] text-xs mt-4">
          保證金用於發佈出售或購買USDT廣告，提交認證信息即時從資產餘額中進行凍結。
        </div>
        <Button block color="primary" className="mt-10">
          申請取消商家認證
        </Button>
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 0;
  }

  .adm-list-item-content-extra {
    color: #1a1717;
    font-size: 14px;
  }
`;

export default MerchantAuthentication;
