import { TextArea } from 'antd-mobile';
import { orderBy } from 'lodash-es';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useInterval } from 'react-use';
import { Virtuoso } from 'react-virtuoso';
import styled from 'styled-components';
import {
  useFindStaffChatListAnonymous,
  useGetCustomerServiceAnonymous,
  useSendSayAnonymous,
} from '../../api/endpoints/transformer';
import { ChatListItem } from '../../api/model';
import ic_default_head from '../../assets/ic_default_head.png';
import Screen from '../../components/Screen';

const Content = ({ type, say }: { type?: string; say?: string }) => {
  switch (type) {
    case 'img':
      return <img alt="" src={say} className=" w-[150px] h-[200px] rounded-md" />;

    default:
      return (
        <div className="p-2.5 break-all min-w-[60px] max-w-[245px] min-h-[40px] text-[#fefefe] rounded bg-[#444]">
          {say}
        </div>
      );
  }
};

const AnonymousChat = () => {
  const intl = useIntl();

  const { data: customerServiceAnonymous } = useGetCustomerServiceAnonymous();
  const { data, refetch } = useFindStaffChatListAnonymous();

  useInterval(() => {
    refetch();
  }, 2000);

  const today = useMemo(() => moment(), []);

  const renderTime = useCallback(
    (value?: string) => {
      const m = moment(new Date(Number(value) * 1000));
      if (today.isSame(m, 'day')) {
        return m.format('HH:mm');
      }
      if (today.diff(m, 'day') <= 7) {
        return m.format('dd HH:mm');
      }
      if (today.isSame(m, 'year')) {
        return m.format('MM-DD HH:mm');
      }
      return m.format('YYYY-MM-DD HH:mm');
    },
    [today],
  );

  const renderItemContent = useCallback(
    (index: number, item: ChatListItem) => {
      return (
        <div className="mt-2.5 px-4">
          <div className="flex justify-center">
            <span className="text-xs text-[#262626] bg-[#f4f4f4] rounded py-1 px-2.5">
              {renderTime(item.createTime)}
            </span>
          </div>
          <div
            className={`flex gap-2.5 py-2.5 ${
              item.from?.includes('.') ? 'justify-end' : 'flex-row-reverse justify-end'
            }`}
          >
            <Content type={item.type} say={item.say} />

            <img
              alt=""
              src={
                item.from?.includes('.')
                  ? ic_default_head
                  : customerServiceAnonymous?.data?.customerServiceStaff?.headUrl
              }
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      );
    },
    [customerServiceAnonymous?.data?.customerServiceStaff?.headUrl, renderTime],
  );

  const [text, setText] = useState<string>('');

  const sendOtcChat = useSendSayAnonymous({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setText('');
          refetch();
        }
      },
    },
  });

  const sendText = useCallback(() => {
    if (text.length) {
      sendOtcChat.mutate({
        data: {
          say: text,
        },
      });
    }
  }, [sendOtcChat, text]);

  const sorted = useMemo(() => orderBy(data?.data ?? [], ['createTime'], 'asc'), [data?.data]);

  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? 'smooth' : false;
  }, []);

  return (
    <Screen headerTitle={customerServiceAnonymous?.data?.customerServiceStaff?.userName}>
      <Container className="h-full flex flex-col">
        <Virtuoso
          className="flex-1"
          initialTopMostItemIndex={sorted.length - 1}
          data={sorted}
          itemContent={renderItemContent}
          keyParams="chatId"
          followOutput={followOutput}
        />

        <div className=" w-full bg-white relative z-10">
          <div className="bg-[#f7f7f9] px-2.5 flex relative">
            <TextArea className="mr-[40px]" onChange={setText} value={text} />
            <div className="absolute right-2.5 bottom-1">
              <a
                className=" w-[45px] h-8  flex items-center justify-center bg-[#06be04] text-white rounded"
                onClick={sendText}
              >
                {intl.formatMessage({ defaultMessage: '發送', id: '9V7qTC' })}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Screen>
  );
};

const Container = styled.div``;

export default AnonymousChat;
