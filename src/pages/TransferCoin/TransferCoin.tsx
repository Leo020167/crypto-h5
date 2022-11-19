import { Button, Input, List, Popup } from 'antd-mobile';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import ic_transfer_point from '../../assets/ic_transfer_point.png';
import Screen from '../../components/Screen';

/**
 * 划转
 * @returns
 */
const TransferCoin = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Container
      headerTitle="劃轉"
      navBarProps={{
        right: <Link to="/transfer-coin-history">記錄</Link>,
      }}
      footer={
        <div className="px-4 mb-4">
          <Button block color="primary">
            劃轉
          </Button>
        </div>
      }
    >
      <div className="h-28 m-5 border flex items-center justify-center">
        <div className="ml-4">
          <img alt="" src={ic_transfer_point} className="h-14" />
        </div>

        <div className="flex-1 ml-4 h-full flex flex-col">
          <div className="border-b flex items-center flex-1">
            <span className="text-[#663D3A50]">从</span>
            <a
              className="flex-1 flex items-center justify-between px-4"
              onClick={() => setVisible(true)}
            >
              <span>余额账户</span>
              <Arrow />
            </a>
          </div>
          <div className=" flex items-center flex-1">
            <span className="text-[#663D3A50]">到</span>
            <a
              className="flex-1 flex  items-center justify-between px-4"
              onClick={() => setVisible(true)}
            >
              <span>股指期货账户</span>
              <Arrow />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="text-[#1D3155]">划转数量</div>
        <div className="relative flex items-center">
          <Input
            type="number"
            className="border-b py-2 font-bold pr-20"
            value="1.0"
            maxLength={18}
            placeholder="输入划转数量"
          />
          <div className="absolute right-12 text-[#666175AE]">USDT</div>
          <a className="absolute right-0 text-[#6175AE] text-xs">全部</a>
        </div>
        <div className="text-[#666175AE] mt-1 text-xs">可用数量：</div>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-[#F2F2F2] p-2 text-[#663D3A50]">
          只有將資產划轉到相對應的賬戶才可以進行交易。賬戶間的划轉不收取手續費
        </div>
      </div>

      <Popup visible={visible} position="right">
        <Screen
          headerTitle="选择账户"
          navBarProps={{
            onBack() {
              setVisible(false);
            },
          }}
        >
          <List>
            <List.Item arrow={null} onClick={() => setVisible(false)}>
              1
            </List.Item>
            <List.Item>2</List.Item>
            <List.Item>3</List.Item>
          </List>
        </Screen>
      </Popup>
    </Container>
  );
};

const Container = styled(Screen)`
  .adm-list-item-title {
    .adm-form-item-label {
      color: #1d3155;
      font-size: 14px;
    }
  }
`;

export default TransferCoin;
