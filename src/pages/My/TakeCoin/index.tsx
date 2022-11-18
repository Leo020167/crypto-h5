import { Button, Form, Input, NavBar } from 'antd-mobile';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TakeCoin = () => {
  const navigate = useNavigate();
  return (
    <Container className="h-screen bg-white flex flex-col">
      <NavBar onBack={() => navigate(-1)} right={<Link to="/take-coin-history">记录</Link>}>
        提币
      </NavBar>
      <div className="px-4 flex-1 overflow-y-auto">
        <div className="mt-4">
          <div className="text-[#1D3155]">充值网络</div>
          <div className="flex justify-between mt-2">
            <div className="py-2 px-1.5 border-2 text-xs flex items-center rounded border-[#727fa0] text-[#727fa0]">
              USDT-trc20
            </div>
            <div className="py-2 px-1.5 border-2 text-xs flex items-center rounded border-[#919191] text-[#919191]">
              USDT-erc20
            </div>
            <div className="py-2 px-1.5 border-2 text-xs flex items-center rounded border-[#919191] text-[#919191]">
              USDT-omni
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Form.Item label="提币地址">
            <Input className="address py-2" placeholder="输入或长按粘贴地址" />
          </Form.Item>
        </div>
        <div className="mt-4">
          <div className=" h-32 flex items-center">
            <div className="flex-1  text-base">提币二维码</div>
            <div className="text-center text-[#00C8FF]">
              点击此处上传
              <br />
              提币二维码
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Form.Item label="数量">
            <Input className="amount py-2" placeholder="输入提币数量" />
            <div className="absolute right-10 text-[#666175AE]">--</div>
            <a className="text-xs text-[#6175AE] absolute right-0">全部</a>
          </Form.Item>
          <div className="text-[#666175AE] text-xs">可提币数量: 100000.0</div>
        </div>

        <div className="mt-4">
          <Form.Item label="手续费">
            <Input type="number" className="amount py-2" value="1.0" maxLength={18} />
            <div className="absolute right-0 text-[#666175AE]">Token</div>
          </Form.Item>
        </div>
      </div>

      <div className="flex justify-between px-4 mb-4 pt-2.5">
        <span className="text-[#1D3155]">到账数量：</span>
        <span className="text-[#1D3155] font-bold">0.00000000</span>
      </div>

      <div className="px-4 mb-4">
        <Button block color="primary">
          提币
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .address,
  .amount {
    border-bottom: 1px solid #f0f0f0;
    color: #1d3155;
  }

  .amount {
    flex: 1;
  }
  .adm-form-item-child-inner {
    position: relative;
    display: flex;
    align-items: center;
  }

  .adm-list-item-title {
    .adm-form-item-label {
      color: #1d3155;
      font-size: 14px;
    }
  }
`;

export default TakeCoin;
