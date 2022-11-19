import { Button, Input, List, Modal, NavBar, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useInviteBuy, useInviteHome } from '../../api/endpoints/transformer';
import ic_default_head from '../../assets/ic_default_head.png';
import { userAtom } from '../../atoms';

const Community = () => {
  const user = useAtomValue(userAtom);

  const [visible, setVisible] = useState(false);

  const [count, setCount] = useState<string>();

  const { data: inviteHome, refetch } = useInviteHome(
    { userId: user?.userId },
    { query: { enabled: !!user?.userId } },
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
      Toast.show('請輸入兌換數量');
      return;
    }

    inviteBuy.mutate({
      data: {
        count: Number(count),
        userId: user?.userId,
      },
    });
  }, [count, inviteBuy, user?.userId]);

  return (
    <Container className="bg-[#4d4ce6] flex-1 flex flex-col min-h-0">
      <div>
        <NavBar back={null} className="text-white">
          我的社區
        </NavBar>
        <div className="mt-4 px-4 h-40 text-white ">
          <div className="flex">
            <div className="h-10 w-10 rounded-full mr-2.5 overflow-hidden">
              <img alt="" src={user?.headUrl ?? ic_default_head} />
            </div>
            <div>
              <span className="text-sm">{user?.userName}</span>
              <div className="mt-2 text-xs text-[#dae1f8]">
                <span className="mr-8">社區人數：{inviteHome?.data?.teamCount}</span>
                <span>邀請碼數量：{inviteHome?.data?.inviteCount}</span>
              </div>
            </div>
          </div>

          <div className="text-[#dae1f8] mt-8 text-xs">社區總獎勵(TFU)</div>
          <div className="text-white mt-4 text-3xl">{inviteHome?.data?.sumAmount ?? '0.00'}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-t-3xl bg-white min-h-0 ">
        <div className=" h-8 mt-6 flex">
          <span className=" text-[#747474] w-1/4 text-center">邀請碼</span>
          <span className=" text-[#747474] w-1/4 text-center">狀態</span>
          <span className=" text-[#747474] w-1/4 text-center">成員</span>
          <span className=" text-[#747474] w-1/4 text-center">獎勵（TFU）</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <List>
            {inviteHome?.data?.inviteList?.map((v, i) => (
              <List.Item key={i}>
                <div className="h-4 flex">
                  <span className=" text-[#747474] w-1/4 text-center">{v.inviteCode ?? '-'}</span>
                  <span className=" text-[#747474] w-1/4 text-center">
                    {v.status ? (v.status === '0' ? '未使用' : '已使用') : '-'}
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
          兌換邀請碼
        </a>
      </div>

      <ModalWrapper
        title="兌換邀請碼"
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
                placeholder="請輸入兌換數量"
              />
              <div className="text-sm py-4 text-black">
                可兌換數量：{inviteHome?.data?.inviteCodePrice ?? 0}
              </div>
            </div>

            <div className="h-12 flex items-center border-t border-[#909090]">
              <Button className="flex-1 text-center" fill="none" onClick={() => setVisible(false)}>
                取消
              </Button>
              <div className="w-[1px] bg-[#909090] h-full"></div>
              <Button
                className="flex-1 text-center h-full"
                fill="none"
                onClick={buy}
                loading={inviteBuy.isLoading}
              >
                確定
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
