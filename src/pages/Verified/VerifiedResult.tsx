import { List, NavBar } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useIdentityGet } from '../../api/endpoints/transformer';
import id1 from '../../assets/id1.png';
import id2 from '../../assets/id2.png';
import { stringDateFormat } from '../../utils/date';

const VerifiedResult = () => {
  const history = useHistory();

  const { data } = useIdentityGet();

  const identityAuth = useMemo(() => data?.data?.identityAuth, [data?.data?.identityAuth]);

  const intl = useIntl();

  return (
    <Container className="h-screen bg-white">
      <div className="bg-[#1677ff]">
        <NavBar onBack={() => history.goBack()}>
          {intl.formatMessage({ defaultMessage: '實名認證中心', id: 'bweeFF' })}
        </NavBar>
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-[128px] h-[104px] identity flex items-center justify-center relative">
            <img alt="" src={id2} className=" w-[90px]" />
            <div className="bg-[#ffce23] text-white px-4 py-1 text-xs absolute bottom-0">
              {intl.formatMessage({ defaultMessage: '實名認證成功', id: 'UvWwpv' })}
            </div>
          </div>

          <div className="mt-4 mb-8 text-white">
            {intl.formatMessage({ defaultMessage: '您已通過實名認證', id: 'Du+HBZ' })}
          </div>
        </div>
      </div>

      <List>
        <List.Item
          title={intl.formatMessage({ defaultMessage: '真實姓名', id: 'v5SgYb' })}
          extra={<span className="text-xs">{identityAuth?.name}</span>}
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '證件號', id: 'MN40Dh' })}
          extra={<span className="text-xs">{identityAuth?.certNo}</span>}
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '認證狀態', id: 'Xj/GCF' })}
          extra={
            <span className="text-[#0CC741] text-xs">
              {intl.formatMessage({ defaultMessage: '已實名認證', id: 'VldACD' })}
            </span>
          }
        />
        <List.Item
          title={intl.formatMessage({ defaultMessage: '認證日期', id: 'Uw5tn0' })}
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
