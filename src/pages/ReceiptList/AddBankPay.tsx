import { Button, Form, Input, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
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

  const intl = useIntl();

  const handleFinish = useCallback(() => {
    if (!name || !name.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入姓名', id: 'ddZtfx' }));
      return;
    }
    if (!bankNumber || !bankNumber.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入銀行卡號', id: 'Y2Ed0L' }));
      return;
    }
    if (!bankName || !bankName.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入開戶銀行名稱', id: 'bwg6o7' }));
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
  }, [bankName, bankNumber, intl, name, otcPaymentSave, receiptType]);

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '添加银行卡', id: '42lMqW' })}
      footer={
        <div className="px-4">
          <div className=" h-14 px-4 bg-[#fef7ef] flex items-center border border-dashed rounded border-blue-600 text-[#6175AE] text-xs">
            <img alt="" src={ic_warning} width="15" className="mr-2" />
            {intl.formatMessage({
              defaultMessage: '請務必使用與您註冊手機號碼一致的實名賬號',
              id: 'S7E2WU',
            })}
          </div>
          <Button block color="primary" className="my-6" onClick={handleFinish}>
            {intl.formatMessage({
              defaultMessage: '保存',
              id: 'b5l2vN',
            })}
          </Button>
        </div>
      }
    >
      <Container>
        <Form className="px-4" layout="vertical">
          <Form.Item
            label={intl.formatMessage({
              defaultMessage: '开户姓名',
              id: '9piGP6',
            })}
          >
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '请输入姓名',
                id: 'RtJnaj',
              })}
              name={name}
              onChange={setName}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              defaultMessage: '开户银行',
              id: 'LaFd5t',
            })}
          >
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '请输入开户银行',
                id: 'Au/GQB',
              })}
              name={bankNumber}
              onChange={setBankNumber}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              defaultMessage: '银行卡号',
              id: 's7aJO6',
            })}
          >
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: '请输入银行卡号',
                id: 'MGGEAi',
              })}
              name={bankName}
              onChange={setBankName}
            />
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
