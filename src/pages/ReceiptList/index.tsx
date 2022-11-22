import { Button, Dialog, List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOtcFindMyPaymentList, useOtcPaymentDelete } from '../../api/endpoints/transformer';
import ic_payment_no_data from '../../assets/ic_payment_no_data.png';
import Screen from '../../components/Screen';

const Empty = () => (
  <div className="flex flex-col items-center justify-center mt-8">
    <div className="w-1/2">
      <img alt="" src={ic_payment_no_data} className="w-full" />
    </div>
    <div className="text-[#bec0ce] text-base mt-8">未添加账户</div>
  </div>
);

// TODO 我的收款方式 1选择我的收款方式
const ReceiptList = () => {
  const history = useHistory();
  const location = useLocation();

  const { data, refetch } = useOtcFindMyPaymentList();

  const myPaymentList = useMemo(() => data?.data?.myPaymentList ?? [], [data?.data?.myPaymentList]);

  const otcPaymentDelete = useOtcPaymentDelete({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  return (
    <Screen
      headerTitle="收款管理"
      footer={
        <div className="px-4 mb-4">
          <Button
            block
            color="primary"
            onClick={() =>
              history.push({
                pathname: '/add-receipt',
                search: stringify({ from: location.pathname }),
              })
            }
          >
            添加
          </Button>
        </div>
      }
    >
      {myPaymentList.length ? (
        <List>
          {myPaymentList.map((v) => (
            <List.Item key={v.paymentId}>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <img alt="" src={v.receiptLogo ?? ''} className=" w-6 h-6 mr-2" />
                  <span className="text-[#3D3A50] text-base font-bold flex-1">
                    {Number(v.receiptType) === 3 ? v.bankName : v.receiptTypeValue}
                  </span>
                  <a
                    className="text-sm text-[#6175AE]"
                    onClick={() => {
                      Dialog.confirm({
                        title: '確定刪除',

                        confirmText: '刪除',
                        onConfirm() {
                          otcPaymentDelete.mutate({ data: { paymentId: v.paymentId } });
                        },
                      });
                    }}
                  >
                    刪除
                  </a>
                </div>
                <span className="text-[#3D3A50] mt-2">{v.receiptName}</span>
                <span className="mt-2 text-lg text-[#3D3A50] font-bold">{v.receiptNo}</span>
              </div>
            </List.Item>
          ))}
        </List>
      ) : (
        <Empty />
      )}
    </Screen>
  );
};

export default ReceiptList;
