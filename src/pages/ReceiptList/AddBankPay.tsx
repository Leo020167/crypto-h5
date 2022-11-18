import { Button, Form, Input } from 'antd-mobile';
import styled from 'styled-components';
import ic_warning from '../../assets/ic_warning.png';
import Screen from '../../components/Screen';

const AddBankPay = () => {
  return (
    <Screen
      headerTitle="添加银行卡"
      footer={
        <div className="px-4">
          <div className=" h-14 px-4 bg-[#fef7ef] flex items-center border border-dashed rounded border-blue-600 text-[#6175AE] text-xs">
            <img alt="" src={ic_warning} width="15" className="mr-2" />
            請務必使用與您註冊手機號碼一致的實名賬號
          </div>
          <Button block color="primary" className="my-6">
            保存
          </Button>
        </div>
      }
    >
      <Container>
        <Form className="px-4" layout="vertical">
          <Form.Item label="开户姓名">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="开户银行">
            <Input placeholder="请输入开户银行" />
          </Form.Item>
          <Form.Item label="银行卡号">
            <Input placeholder="请输入银行卡号" />
          </Form.Item>
        </Form>
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-input-element {
    padding: 0;
  }
`;

export default AddBankPay;
