import { Grid, TextArea, Toast } from 'antd-mobile';
import { orderBy } from 'lodash-es';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Virtuoso } from 'react-virtuoso';
import styled from 'styled-components';
import {
  useFindStaffChatList,
  useGetCustomerService,
  useSendImage,
  useSendSay,
} from '../../api/endpoints/transformer';
import { ChatListItem } from '../../api/model';
import ic_circle_chat_fragment_more_pic from '../../assets/ic_circle_chat_fragment_more_pic.png';
import ic_default_head from '../../assets/ic_default_head.png';
import type_select_btn_nor from '../../assets/type_select_btn_nor.png';
import ImagePicker from '../../components/ImagePicker';
import Screen from '../../components/Screen';
import { useAuthStore } from '../../stores/auth';
import { uploadImage } from '../../utils/upload';

const Content = ({ type, say }: { type?: string; say?: string }) => {
  switch (type) {
    case 'img':
      return <img alt="" src={say} className=" h-[200px] w-[150px] rounded-md" />;

    default:
      return (
        <div className="min-h-[40px] min-w-[60px] max-w-[245px] break-all rounded bg-[#444] p-2.5 text-[#fefefe]">
          {say}
        </div>
      );
  }
};

const Chat = () => {
  const intl = useIntl();

  const { data, refetch } = useFindStaffChatList();

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
            <span className="rounded bg-[#f4f4f4] px-2.5 py-1 text-xs text-[#262626]">
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

            <img alt="" src={item.headUrl ?? ic_default_head} className="h-10 w-10 rounded-full" />
          </div>
        </div>
      );
    },
    [renderTime, userInfo?.userId],
  );

  const [text, setText] = useState<string>('');

  const sendSay = useSendSay({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setText('');
          refetch();
        }
      },
    },
  });

  const { data: getCustomerService } = useGetCustomerService();

  const sendText = useCallback(() => {
    sendSay.mutate({
      data: {
        chatTopic: getCustomerService?.data?.customerServiceStaff?.chatTopic,
        say: text,
      },
    });
  }, [getCustomerService?.data?.customerServiceStaff?.chatTopic, sendSay, text]);

  const sendImage = useSendImage({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.clear();
          setVisible(false);
          refetch();
        }
      },
    },
  });

  const sorted = useMemo(() => orderBy(data?.data ?? [], ['createTime'], 'asc'), [data?.data]);

  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? 'smooth' : false;
  }, []);

  const [visible, setVisible] = useState(false);

  return (
    <Screen headerTitle={intl.formatMessage({ defaultMessage: '綫上客服', id: 'wwOQz6' })}>
      <Container className="flex h-full flex-col pb-10">
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
          className="fixed bottom-0 w-full bg-white transition-all"
        >
          <div className="relative flex bg-[#f7f7f9] px-2.5">
            <TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="mr-[40px]"
              onChange={setText}
              value={text}
            />
            <div className="absolute bottom-1 right-2.5">
              {text?.length ? (
                <a
                  className=" flex h-8  w-[45px] items-center justify-center rounded bg-[#06be04] text-white"
                  onClick={sendText}
                >
                  {intl.formatMessage({ defaultMessage: '發送', id: '9V7qTC' })}
                </a>
              ) : (
                <a onClick={() => setVisible(!visible)}>
                  <img alt="" src={type_select_btn_nor} className="h-8 w-8" />
                </a>
              )}
            </div>
          </div>
          <div className="h-[300px] p-5">
            <Grid columns={4} gap={10}>
              <Grid.Item>
                <ImagePicker
                  onChange={(e) => {
                    if (e.target.files) {
                      const formData = new FormData();
                      formData.append('imageFiles', e.target.files[0]);

                      uploadImage(formData).then((res: any) => {
                        const image = res.data.data?.imageUrlList?.[0];

                        sendImage.mutate({
                          data: {
                            chatTopic: getCustomerService?.data?.customerServiceStaff?.chatTopic,
                            say: image,
                          },
                        });
                        Toast.show({ icon: 'loading', duration: 0 });
                      });
                    }
                  }}
                >
                  <a className="flex flex-col items-center justify-center rounded border ">
                    <img alt="" src={ic_circle_chat_fragment_more_pic} className="h-10 w-10" />
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

export default Chat;
