import { Dialog, List, NavBar, Toast } from 'antd-mobile';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { tokenAtom, userAtom } from '../../atoms';
import { doSecurityLogout } from '../../utils/api';
import RefreshRateList from './RefreshRateList';

const Settings = () => {
  const navigate = useNavigate();
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);

  const [openRefreshRate, setOpenRefreshRate] = useState(false);
  return (
    <div>
      <NavBar onBack={() => navigate(-1)} className="bg-white mb-2">
        设置
      </NavBar>
      <List className="mb-2">
        <List.Item arrow={<Arrow />} onClick={() => navigate('/change-password')}>
          修改密码
        </List.Item>
        <List.Item arrow={<Arrow />}>绑定手机</List.Item>
        <List.Item arrow={<Arrow />}>涨跌颜色</List.Item>
      </List>
      <List className="mb-2">
        <List.Item arrow={<Arrow />} onClick={() => setOpenRefreshRate(true)}>
          刷新频率设置
        </List.Item>
        {/* <List.Item arrow={<Arrow />}>消息推送</List.Item> */}
        {/* <List.Item arrow={<Arrow />}>消除缓存</List.Item> */}
      </List>
      <List className="mb-2">
        <List.Item
          arrow={<Arrow />}
          onClick={() => {
            window.open(
              'http://api.piglobalexchanges.com/procoin/article/#/passgeDetail?article_id=60',
            );
          }}
        >
          关于我们
        </List.Item>
      </List>
      <List className="mb-2">
        <List.Item
          arrow={null}
          className="text-center "
          onClick={() => {
            Dialog.confirm({
              title: '注销',
              content: '你确定要注销吗?',
              onConfirm() {
                setToken('');
                setUser(null);
                doSecurityLogout();
                Toast.show('退出成功');
                navigate('/login', { replace: true });
              },
            });
          }}
        >
          <span className="text-[#fe6b1d]">退出登录</span>
        </List.Item>
      </List>

      <RefreshRateList open={openRefreshRate} onClose={() => setOpenRefreshRate(false)} />
    </div>
  );
};

export default Settings;
