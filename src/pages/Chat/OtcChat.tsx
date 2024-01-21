import { Grid, TextArea } from 'antd-mobile';
import { orderBy } from 'lodash-es';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Virtuoso } from 'react-virtuoso';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useFindOtcChatList, useSendOtcChat } from '../../api/endpoints/transformer';
import { ChatListItem } from '../../api/model';
import ic_circle_chat_fragment_more_pic from '../../assets/ic_circle_chat_fragment_more_pic.png';
import ic_default_head from '../../assets/ic_default_head.png';
import type_select_btn_nor from '../../assets/type_select_btn_nor.png';
import ImagePicker from '../../components/ImagePicker';
import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
import { uploadImage } from '../../utils/upload';
import { useInterval } from "react-use";

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

const OtcChat = () => {
  const [orderId] = useQueryParam('orderId', StringParam);

  const intl = useIntl();

  const { data, refetch } = useFindOtcChatList(
    { orderId: orderId ?? '' },
    {
      query: {
        enabled: !!orderId,
      },
    },
  );

  const { userInfo } = useAuthStore();

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
              userInfo?.userId === item.userId ? 'justify-end' : 'flex-row-reverse justify-end'
            }`}
          >
            {/* <img alt="" src={ic_chat_resend} className="w-5 h-5 self-center" /> */}
            <Content type={item.type} say={item.say} />

            <img alt="" src={item.headUrl ?? ic_default_head} className="w-10 h-10 rounded-full" />
          </div>
        </div>
      );
    },
    [renderTime, userInfo?.userId],
  );

  const [text, setText] = useState<string>('');

  const sendOtcChat = useSendOtcChat({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setVisible(false);
          setText('');
          refetch();
        }
      },
    },
  });

  const sendText = useCallback(() => {
    sendOtcChat.mutate({
      data: {
        orderId: orderId ?? '',
        say: text,
        type: 'text',
      },
    });
  }, [orderId, sendOtcChat, text]);

  const sendImage = useCallback(
    (url: string) => {
      sendOtcChat.mutate({
        data: {
          orderId: orderId ?? '',
          say: url,
          type: 'img',
        },
      });
    },
    [orderId, sendOtcChat],
  );

  const sorted = useMemo(() => orderBy(data?.data ?? [], ['createTime'], 'asc'), [data?.data]);

  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? 'smooth' : false;
  }, []);

  const [visible, setVisible] = useState(false);
  useInterval(() => refetch(), 1000);
  return (
    <Screen headerTitle='商家对话中'>
      <Container className="h-full flex flex-col pb-10">
        <Virtuoso
          className="flex-1 "
          initialTopMostItemIndex={sorted.length - 1}
          data={sorted}
          itemContent={renderItemContent}
          keyParams="chatId"
          followOutput={followOutput}
        />

        <div
          style={{ transform: `translateY(${visible ? '0px' : '300px'})` }}
          className="transition-all fixed w-full bottom-0 bg-white"
        >
          <div className="bg-[#f7f7f9] px-2.5 flex relative">
            <TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="mr-[40px]"
              onChange={setText}
              value={text}
            />
            <div className="absolute right-2.5 bottom-1">
              {text?.length ? (
                <a
                  className=" w-[45px] h-8  flex items-center justify-center bg-[#06be04] text-white rounded"
                  onClick={sendText}
                >
                  {intl.formatMessage({ defaultMessage: '發送', id: '9V7qTC' })}
                </a>
              ) : (
                <a onClick={() => setVisible(!visible)}>
                  <img alt="" src={type_select_btn_nor} className="w-8 h-8" />
                </a>
              )}
            </div>
          </div>
          <div className="p-5 h-[300px]">
            <Grid columns={4} gap={10}>
              <Grid.Item>
                <ImagePicker
                  onChange={(e) => {
                    if (e.target.files) {
                      const formData = new FormData();
                      formData.append('imageFiles', e.target.files[0]);

                      uploadImage(formData).then((res: any) => {
                        const image = res.data.data?.imageUrlList?.[0];
                        sendImage(image);
                      });
                    }
                  }}
                >
                  <a className="flex flex-col items-center justify-center border rounded ">
                    <img alt="" src={ic_circle_chat_fragment_more_pic} className="w-10 h-10" />
                    <div>{intl.formatMessage({ defaultMessage: '圖片', id: '0asaCS' })}</div>
                  </a>
                </ImagePicker>
              </Grid.Item>
            </Grid>
          </div>
        </div>
      </Container>
    </Screen>
  );
};

const Container = styled.div``;

export default OtcChat;
