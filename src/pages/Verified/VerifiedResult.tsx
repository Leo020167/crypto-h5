import { List, NavBar } from 'antd-mobile';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useIdentityGet } from '../../api/endpoints/transformer';
import id1 from '../../assets/id1.png';
import id2 from '../../assets/id2.png';
import { stringDateFormat } from '../../utils/date';

const VerifiedResult = () => {
  const navigate = useNavigate();

  const { data } = useIdentityGet();

  const identityAuth = useMemo(() => data?.data?.identityAuth, [data?.data?.identityAuth]);

  return (
    <Container className="h-screen bg-white">
      <div className="bg-[#1677ff]">
        <NavBar onBack={() => navigate(-1)}>實名認證中心</NavBar>
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-[128px] h-[104px] identity flex items-center justify-center relative">
            <img alt="" src={id2} className=" w-[90px]" />
            <div className="bg-[#ffce23] text-white px-4 py-1 text-xs absolute bottom-0">
              實名認證成功
            </div>
          </div>

          <div className="mt-4 mb-8 text-white">您已通過實名認證</div>
        </div>
      </div>

      <List>
        <List.Item title="真實姓名" extra={<span className="text-xs">{identityAuth?.name}</span>} />
        <List.Item title="證件號" extra={<span className="text-xs">{identityAuth?.certNo}</span>} />
        <List.Item
          title="認證狀態"
          extra={<span className="text-[#0CC741] text-xs">已實名認證</span>}
        />
        <List.Item
          title="認證日期"
          extra={
            <span className="text-xs">
              {stringDateFormat(identityAuth?.createTime, 'YYYY-MM-DD')}
            </span>
          }
        />
      </List>
    </Container>
  );
};

const Container = styled.div`
  .adm-nav-bar {
    border: 0;
    background-color: #1677ff;
    color: #fff;
  }

  .identity {
    background-image: url(${id1});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
`;

export default VerifiedResult;
