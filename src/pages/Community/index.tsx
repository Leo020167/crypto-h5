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
    <Container className="flex min-h-0 flex-1 flex-col bg-[#4d4ce6]">
      <div>
        <NavBar back={null} className="text-white">
          {intl.formatMessage({ defaultMessage: '我的社區', id: 'A2jxOW' })}
        </NavBar>
        <div className="mt-4 h-40 px-4 text-white ">
          <div className="flex">
            <div className="mr-2.5 h-10 w-10 overflow-hidden rounded-full">
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

          <div className="mt-8 text-xs text-[#dae1f8]">
            {intl.formatMessage({ defaultMessage: '社區總獎勵(TFU)', id: 'MQKv1T' })}
          </div>
          <div className="mt-4 text-3xl text-white">{inviteHome?.data?.sumAmount ?? '0.00'}</div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-t-3xl bg-white ">
        <div className=" mt-6 flex h-8">
          <span className=" w-1/4 text-center text-[#747474]">
            {intl.formatMessage({ defaultMessage: '邀請碼', id: 'lc43/w' })}
          </span>
          <span className=" w-1/4 text-center text-[#747474]">
            {intl.formatMessage({ defaultMessage: '狀態', id: 'NL+iCs' })}
          </span>
          <span className=" w-1/4 text-center text-[#747474]">
            {intl.formatMessage({ defaultMessage: '成員', id: 'lxxud1' })}
          </span>
          <span className=" w-1/4 text-center text-[#747474]">
            {intl.formatMessage({ defaultMessage: '獎勵(TFU)', id: 'zqkaAr' })}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <List>
            {inviteHome?.data?.inviteList?.map((v, i) => (
              <List.Item key={i}>
                <div className="flex h-4">
                  <span className=" w-1/4 text-center text-[#747474]">{v.inviteCode ?? '-'}</span>
                  <span className=" w-1/4 text-center text-[#747474]">
                    {v.status
                      ? v.status === '0'
                        ? intl.formatMessage({ defaultMessage: '未使用', id: 'wNYTXq' })
                        : intl.formatMessage({ defaultMessage: '已使用', id: 'c6kvxO' })
                      : '-'}
                  </span>
                  <span className=" w-1/4 text-center text-[#747474]">{v.inviteUserId ?? '-'}</span>
                  <span className=" w-1/4 text-center text-[#747474]">{v.amount ?? '-'}</span>
                </div>
              </List.Item>
            ))}
          </List>
        </div>
      </div>

      <div className="bg-white px-10">
        <a
          className="mb-6 mt-2 flex h-12 items-center justify-center rounded-3xl bg-[#4d4ce6] text-white"
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
                className="mt-6 h-12 rounded  border border-black px-2.5 text-sm"
                placeholder={intl.formatMessage({ defaultMessage: '請輸入兌換數量', id: 'RGKUXx' })}
              />
              <div className="py-4 text-sm text-black">
                {intl.formatMessage({ defaultMessage: '可兌換數量：', id: 'WKCB03' })}
                {inviteHome?.data?.inviteCodePrice ?? 0}
              </div>
            </div>

            <div className="flex h-12 items-center border-t border-[#909090]">
              <Button className="flex-1 text-center" fill="none" onClick={() => setVisible(false)}>
                {intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' })}
              </Button>
              <div className="h-full w-[1px] bg-[#909090]"></div>
              <Button
                className="h-full flex-1 text-center"
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
    border: 0;
    background-color: #4d4ce6;
  }
`;

export default Community;
