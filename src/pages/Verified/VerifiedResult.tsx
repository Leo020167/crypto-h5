import { List, NavBar } from 'antd-mobile';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useIdentityGet } from '../../api/endpoints/transformer';
import id2 from '../../assets/id2.png';
import { stringDateFormat } from '../../utils/date';

const VerifiedResult = () => {
  const history = useHistory();

  const { data } = useIdentityGet({});

  const identityAuth = useMemo(() => data?.data?.identityAuth, [data?.data?.identityAuth]);

  const intl = useIntl();

  return (
    <Container className="h-screen bg-white dark:bg-[#161720]">
      <div className="bg-[#1677ff] dark:bg-[#161720]">
        <NavBar onBack={() => history.goBack()} className="bg-[#1677ff] dark:bg-[#161720]">
          {intl.formatMessage({ defaultMessage: '實名認證中心', id: 'bweeFF' })}
        </NavBar>
        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="identity relative flex h-[104px] w-[128px] items-center justify-center">
            <img alt="" src={id2} className=" w-[90px]" />
            <div className="absolute bottom-0 bg-[#ffce23] px-4 py-1 text-xs text-white">
              {intl.formatMessage({ defaultMessage: '實名認證成功', id: 'UvWwpv' })}
            </div>
          </div>

          <div className="mb-8 mt-4 text-white">
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
            <span className="text-xs text-[#0CC741]">
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

    color: #fff;
  }
`;

export default VerifiedResult;
