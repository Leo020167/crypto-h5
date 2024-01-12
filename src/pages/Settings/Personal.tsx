import { Input, List, Modal, NavBar, TextArea, Toast } from 'antd-mobile';
import { CheckOutline } from 'antd-mobile-icons';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getUserInfo } from '../../api/endpoints/transformer';

import defaultHead from '../../assets/ic_default_head.png';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { useAuthStore } from '../../stores/auth';

import { userUpdateUserInfo } from '../../utils/api';

const Personal = () => {
  const history = useHistory();
  const { userInfo } = useAuthStore();

  const [holderUserName, setHolderUserName] = useState<string>(userInfo?.userName ?? '');
  const [holderDescribes, setHolderDescribes] = useState<string>(userInfo?.describes ?? '');

  const [sex, setSex] = useState<string>(userInfo?.sex ?? '0');
  const [userName, setUserName] = useState<string>(userInfo?.userName ?? '');
  const [describes, setDescribes] = useState<string>(userInfo?.describes ?? '');

  const [action, setAction] = useState<'edit-userName' | 'edit-describes'>();

  const intl = useIntl();
  const updateUserInfo = useCallback(() => {
    Toast.show({
      icon: 'loading',
      duration: 0,
      maskClickable: false,
    });
    userUpdateUserInfo({ sex, userName, describes }).then((res: any) => {
      if (res.code === '200') {
        getUserInfo();

        Toast.show(intl.formatMessage({ defaultMessage: '更新信息成功', id: 'LTp8Pi' }));
        history.replace('/home/my');
      }
    });
  }, [describes, history, intl, sex, userName]);

  return (
    <Container className="h-full bg-[#F0F1F7]">
      <NavBar
        onBack={() => history.goBack()}
        className="mb-2 bg-white"
        right={
          <div className="flex justify-end">
            <a onClick={updateUserInfo}>
              <CheckOutline fontSize={24} />
            </a>
          </div>
        }
      >
        {intl.formatMessage({ defaultMessage: '个人设置', id: 'zL7URC' })}
      </NavBar>

      <List className="mb-2">
        {/*<List.Item*/}
        {/*  arrow={<Arrow />}*/}
        {/*  extra={*/}
        {/*    <div className="mr-4 h-8 w-8 overflow-hidden rounded-full">*/}
        {/*      <img alt="head" src={userInfo?.headUrl ?? defaultHead} />*/}
        {/*    </div>*/}
        {/*  }*/}
        {/*>*/}
        {/*  {intl.formatMessage({ defaultMessage: '头像', id: '65CX2o' })}*/}
        {/*</List.Item>*/}
        <List.Item
          arrow={<Arrow />}
          extra={<div className="mr-4">{userName}</div>}
          onClick={() => {
            setAction('edit-userName');
          }}
        >
          {intl.formatMessage({ defaultMessage: '昵称', id: 'zlZigq' })}
        </List.Item>
        <List.Item arrow={null} extra={<div className="mr-4">{userInfo?.userId}</div>}>
          ID
        </List.Item>
        <List.Item
          arrow={null}
          extra={
            <div className="mr-4 flex h-8  items-center gap-2">
              <a
                className={`rounded bg-[#f6f6f6] px-5 py-1.5 text-xs ${
                  sex === '0' ? 'bg-[#feca0e] text-white' : ''
                }`}
                onClick={() => setSex('0')}
              >
                {intl.formatMessage({ defaultMessage: '男', id: 'mpjnyE' })}
              </a>
              <a
                className={`rounded bg-[#f6f6f6] px-5 py-1.5 text-xs ${
                  sex === '1' ? 'bg-[#feca0e] text-white' : ''
                }`}
                onClick={() => setSex('1')}
              >
                {intl.formatMessage({ defaultMessage: '女', id: 'fKknPq' })}
              </a>
            </div>
          }
        >
          {intl.formatMessage({ defaultMessage: '性别', id: 'O4KgNk' })}
        </List.Item>
        <List.Item
          arrow={<Arrow />}
          extra={
            <div className="mr-4">
              {intl.formatMessage({ defaultMessage: '未设置', id: 'ag8LxW' })}
            </div>
          }
        >
          {intl.formatMessage({ defaultMessage: '生日', id: 'j5arhs' })}
        </List.Item>
      </List>

      <List>
        <List.Item arrow={<Arrow />} onClick={() => setAction('edit-describes')}>
          {intl.formatMessage({ defaultMessage: '个人简介', id: 'lf0jjv' })}
        </List.Item>
        <List.Item arrow={null} onClick={() => setAction('edit-describes')}>
          <span className="text-[#afafaf]">
            {describes ?? intl.formatMessage({ defaultMessage: '请编辑个人简介', id: 'dfCJ6D' })}
          </span>
        </List.Item>
      </List>

      <Modal
        visible={action === 'edit-userName'}
        content={<Input value={holderUserName} onChange={setHolderUserName} />}
        actions={[
          {
            key: 'cancel',
            text: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
            onClick() {
              setAction(undefined);
            },
          },
          {
            key: 'confirm',
            text: intl.formatMessage({ defaultMessage: '确定', id: 'r0/TUu' }),
            onClick() {
              setUserName(holderUserName ?? '');
              setAction(undefined);
            },
          },
        ]}
      />

      <Modal
        key="describes"
        visible={action === 'edit-describes'}
        content={
          <TextArea
            value={holderDescribes}
            onChange={setHolderDescribes}
            maxLength={140}
            placeholder={intl.formatMessage({
              defaultMessage: '写些什么吧...(140个字以内)',
              id: 'oVSEVM',
            })}
            className="text-sm"
          />
        }
        actions={[
          {
            key: 'cancel',
            text: intl.formatMessage({
              defaultMessage: '取消',
              id: '2QzYmY',
            }),
            onClick() {
              setAction(undefined);
            },
          },
          {
            key: 'confirm',
            text: intl.formatMessage({
              defaultMessage: '确定',
              id: 'r0/TUu',
            }),
            onClick() {
              setDescribes(holderDescribes ?? '');
              setAction(undefined);
            },
          },
        ]}
      />
    </Container>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 1.5rem;
  }

  .adm-list-item-content-main {
    padding: 1rem 0;
    color: #1d3155;
    font-size: 0.875rem;
  }

  .adm-list-item-content-arrow {
    color: #aaaaaa;
  }
`;

export default Personal;
