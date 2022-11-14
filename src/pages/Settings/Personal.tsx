import { Input, List, Modal, NavBar, TextArea, Toast } from 'antd-mobile';
import { CheckOutline } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import defaultHead from '../../assets/ic_default_head.png';
import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { userAtom } from '../../atoms';
import { userUpdateUserInfo } from '../../utils/api';

const Personal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);

  const [holderUserName, setHolderUserName] = useState<string>(user?.userName ?? '');
  const [holderDescribes, setHolderDescribes] = useState<string>(user?.describes ?? '');

  const [sex, setSex] = useState<'0' | '1'>(user?.sex ?? '0');
  const [userName, setUserName] = useState<string>(user?.userName ?? '');
  const [describes, setDescribes] = useState<string>(user?.describes ?? '');

  const [action, setAction] = useState<'edit-userName' | 'edit-describes'>();

  const updateUserInfo = useCallback(() => {
    userUpdateUserInfo({ sex, userName, describes }).then((res: any) => {
      if (res.code === '200') {
        setUser({ ...user, ...res.data });

        Toast.show('更新信息成功');
        navigate('/my', { replace: true });
      }
    });
  }, [describes, navigate, setUser, sex, user, userName]);

  return (
    <Container className="bg-[#F0F1F7] h-full">
      <NavBar
        onBack={() => navigate(-1)}
        className="bg-white mb-2"
        right={
          <div className="flex justify-end">
            <a onClick={updateUserInfo}>
              <CheckOutline fontSize={24} />
            </a>
          </div>
        }
      >
        个人设置
      </NavBar>

      <List className="mb-2">
        <List.Item
          arrow={<Arrow />}
          extra={
            <div className="w-8 h-8 rounded-full mr-4 overflow-hidden">
              <img alt="head" src={user?.headUrl ?? defaultHead} />
            </div>
          }
        >
          头像
        </List.Item>
        <List.Item
          arrow={<Arrow />}
          extra={<div className="mr-4">{userName}</div>}
          onClick={() => {
            setAction('edit-userName');
          }}
        >
          昵称
        </List.Item>
        <List.Item arrow={null} extra={<div className="mr-4">{user?.userId}</div>}>
          ID
        </List.Item>
        <List.Item
          arrow={null}
          extra={
            <div className="mr-4 flex h-8  items-center gap-2">
              <a
                className={`rounded px-5 py-1.5 bg-[#f6f6f6] text-xs ${
                  sex === '0' ? 'bg-[#feca0e] text-white' : ''
                }`}
                onClick={() => setSex('0')}
              >
                男
              </a>
              <a
                className={`rounded px-5 py-1.5 bg-[#f6f6f6] text-xs ${
                  sex === '1' ? 'bg-[#feca0e] text-white' : ''
                }`}
                onClick={() => setSex('1')}
              >
                女
              </a>
            </div>
          }
        >
          性别
        </List.Item>
        <List.Item arrow={<Arrow />} extra={<div className="mr-4">未设置</div>}>
          生日
        </List.Item>
      </List>

      <List>
        <List.Item arrow={<Arrow />} onClick={() => setAction('edit-describes')}>
          个人简介
        </List.Item>
        <List.Item arrow={null} onClick={() => setAction('edit-describes')}>
          <span className="text-[#afafaf]">{describes ?? '请编辑个人简介'}</span>
        </List.Item>
      </List>

      <Modal
        visible={action === 'edit-userName'}
        content={<Input value={holderUserName} onChange={setHolderUserName} />}
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick() {
              setAction(undefined);
            },
          },
          {
            key: 'confirm',
            text: '确定',
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
            placeholder="写些什么吧...(140个字以内)"
            className="text-sm"
          />
        }
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick() {
              setAction(undefined);
            },
          },
          {
            key: 'confirm',
            text: '确定',
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
    color: #1d3155;
    font-size: 0.875rem;
    padding: 1rem 0;
  }

  .adm-list-item-content-arrow {
    color: #aaaaaa;
  }
`;

export default Personal;
