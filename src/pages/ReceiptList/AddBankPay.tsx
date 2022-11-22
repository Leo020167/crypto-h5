import { Button, Form, Input, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useOtcPaymentSave } from '../../api/endpoints/transformer';
import ic_warning from '../../assets/ic_warning.png';
import Screen from '../../components/Screen';

const ReceiptTypeParam = withDefault(StringParam, '3');

const AddBankPay = () => {
  const [receiptType] = useQueryParam('receiptType', ReceiptTypeParam);
  const [from] = useQueryParam('from', StringParam);

  const [name, setName] = useState<string>();
  const [bankNumber, setBankNumber] = useState<string>();
  const [bankName, setBankName] = useState<string>();

  const history = useHistory();

  const otcPaymentSave = useOtcPaymentSave({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          if (from) history.replace(from);
        }
      },
    },
  });

  const handleFinish = useCallback(() => {
    if (!name || !name.trim().length) {
      Toast.show('請輸入姓名');
      return;
    }
    if (!bankNumber || !bankNumber.trim().length) {
      Toast.show('請輸入銀行卡號');
      return;
    }
    if (!bankName || !bankName.trim().length) {
      Toast.show('請輸入開戶銀行名稱');
      return;
    }

    otcPaymentSave.mutate({
      data: {
        receiptType,
        paymentId: '0',
        receiptName: name,
        receiptNo: bankNumber,
        bankName: bankName,
        qrCodeUrl: '',
      },
    });
  }, [bankName, bankNumber, name, otcPaymentSave, receiptType]);

  return (
    <Screen
      headerTitle="添加银行卡"
      footer={
        <div className="px-4">
          <div className=" h-14 px-4 bg-[#fef7ef] flex items-center border border-dashed rounded border-blue-600 text-[#6175AE] text-xs">
            <img alt="" src={ic_warning} width="15" className="mr-2" />
            請務必使用與您註冊手機號碼一致的實名賬號
          </div>
          <Button block color="primary" className="my-6" onClick={handleFinish}>
            保存
          </Button>
        </div>
      }
    >
      <Container>
        <Form className="px-4" layout="vertical">
          <Form.Item label="开户姓名">
            <Input placeholder="请输入姓名" name={name} onChange={setName} />
          </Form.Item>
          <Form.Item label="开户银行">
            <Input placeholder="请输入开户银行" name={bankNumber} onChange={setBankNumber} />
          </Form.Item>
          <Form.Item label="银行卡号">
            <Input placeholder="请输入银行卡号" name={bankName} onChange={setBankName} />
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
