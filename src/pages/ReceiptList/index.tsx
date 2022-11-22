import { Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
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

const ReceiptList = () => {
  const history = useHistory();
  return (
    <Screen
      headerTitle="收款管理"
      footer={
        <div className="px-4 mb-4">
          <Button block color="primary" onClick={() => history.push('/add-receipt')}>
            添加
          </Button>
        </div>
      }
    >
      <Empty />
    </Screen>
  );
};

export default ReceiptList;
