import { Button, Input, List, Modal, NavBar, Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useInviteBuy, useInviteHome } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';

import { useAuthStore } from '../../stores/auth';

const Community = () => {
  const intl = useIntl();

  const { userInfo } = useAuthStore();

  const [visible, setVisible] = useState(false);

  const [count, setCount] = useState<string>();

  const { data: inviteHome, refetch } = useInviteHome(
    { userId: userInfo?.userId },
    { query: { enabled: !!userInfo?.userId } },
  );

  const inviteBuy = useInviteBuy({
    mutation: {
      onSuccess(data) {
        Toast.show(data.msg);
        if (data.success) {
          setVisible(false);
          setCount(undefined);
          refetch();
        }
      },
    },
  });

  const buy = useCallback(() => {
    if (!count || !count.trim().length) {
      Toast.show(intl.formatMessage({ defaultMessage: '請輸入兌換數量', id: 'RGKUXx' }));
      return;
    }

    inviteBuy.mutate({
      data: {
        count: Number(count),
        userId: userInfo?.userId,
      },
    });
  }, [count, intl, inviteBuy, userInfo?.userId]);

  return (
    <Container className="bg-[#4d4ce6] flex-1 flex flex-col min-h-0">
      <div>
        <NavBar back={null} className="text-white">
          {intl.formatMessage({ defaultMessage: '我的社區', id: 'A2jxOW' })}
        </NavBar>
        <div className="mt-4 px-4 h-40 text-white ">
          <div className="flex">
            <div className="h-10 w-10 rounded-full mr-2.5 overflow-hidden">
              <img alt="" src={userInfo?.headUrl ?? ic_default_head} />
            </div>
            <div>
              <span className="text-sm">{userInfo?.userName}</span>
              <div className="mt-2 text-xs text-[#dae1f8]">
                <span className="mr-8">
                  {intl.formatMessage({ defaultMessage: '社區人數：', id: 'BsrEsf' })}
                  {inviteHome?.data?.teamCount}
                </span>
                <span>
                  {intl.formatMessage({ defaultMessage: '邀請碼數量：', id: 'ETWocP' })}
                  {inviteHome?.data?.inviteCount}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[#dae1f8] mt-8 text-xs">
            {intl.formatMessage({ defaultMessage: '社區總獎勵(FireGlobal)', id: 'MQKv1T' })}
          </div>
          <div className="text-white mt-4 text-3xl">{inviteHome?.data?.sumAmount ?? '0.00'}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-t-3xl bg-white min-h-0 ">
        <div className=" h-8 mt-6 flex">
          <span className=" text-[#747474] w-1/4 text-center">
            {intl.formatMessage({ defaultMessage: '邀請碼', id: 'lc43/w' })}
          </span>
          <span className=" text-[#747474] w-1/4 text-center">
            {intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
          </span>
          <span className=" text-[#747474] w-1/4 text-center">
            {intl.formatMessage({ defaultMessage: '成員', id: 'lxxud1' })}
          </span>
          <span className=" text-[#747474] w-1/4 text-center">
            {intl.formatMessage({ defaultMessage: '獎勵(FireGlobal)', id: 'zqkaAr' })}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <List>
            {inviteHome?.data?.inviteList?.map((v, i) => (
              <List.Item key={i}>
                <div className="h-4 flex">
                  <span className=" text-[#747474] w-1/4 text-center">{v.inviteCode ?? '-'}</span>
                  <span className=" text-[#747474] w-1/4 text-center">
                    {v.status
                      ? v.status === '0'
                        ? intl.formatMessage({ defaultMessage: '未使用', id: 'wNYTXq' })
                        : intl.formatMessage({ defaultMessage: '已使用', id: 'c6kvxO' })
                      : '-'}
                  </span>
                  <span className=" text-[#747474] w-1/4 text-center">{v.inviteUserId ?? '-'}</span>
                  <span className=" text-[#747474] w-1/4 text-center">{v.amount ?? '-'}</span>
                </div>
              </List.Item>
            ))}
          </List>
        </div>
      </div>

      <div className="bg-white px-10">
        <a
          className="h-12 flex items-center justify-center text-white rounded-3xl bg-[#4d4ce6] mb-6 mt-2"
          onClick={() => setVisible(true)}
        >
          {intl.formatMessage({ defaultMessage: '兌換邀請碼', id: 'O1q1uh' })}
        </a>
      </div>

      <ModalWrapper
        title={intl.formatMessage({ defaultMessage: '兌換邀請碼', id: 'O1q1uh' })}
        visible={visible}
        onClose={() => setVisible(false)}
        bodyClassName="p-0"
        content={
          <div>
            <div className="px-4">
              <Input
                value={count}
                onChange={setCount}
                min={1}
                type="number"
                className="border border-black rounded  h-12 px-2.5 text-sm mt-6"
                placeholder={intl.formatMessage({ defaultMessage: '請輸入兌換數量', id: 'RGKUXx' })}
              />
              <div className="text-sm py-4 text-black">
                {intl.formatMessage({ defaultMessage: '可兌換數量：', id: 'WKCB03' })}
                {inviteHome?.data?.inviteCodePrice ?? 0}
              </div>
            </div>

            <div className="h-12 flex items-center border-t border-[#909090]">
              <Button className="flex-1 text-center" fill="none" onClick={() => setVisible(false)}>
                {intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' })}
              </Button>
              <div className="w-[1px] bg-[#909090] h-full"></div>
              <Button
                className="flex-1 text-center h-full"
                fill="none"
                onClick={buy}
                loading={inviteBuy.isLoading}
              >
                {intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' })}
              </Button>
            </div>
          </div>
        }
        destroyOnClose
      />
    </Container>
  );
};

const ModalWrapper = styled(Modal)`
  .adm-modal-content {
    padding: 0;
  }

  .adm-modal-footer {
    display: none;
  }
`;

const Container = styled.div`
  .adm-nav-bar {
    background-color: #4d4ce6;
    border: 0;
  }
`;

export default Community;
