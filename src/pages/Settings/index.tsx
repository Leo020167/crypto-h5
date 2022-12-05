import { Dialog, List, NavBar, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { useAuthStore } from '../../stores/auth';
import RefreshRateList from './RefreshRateList';
import UpAndDownColorList from './UpAndDownColorList';

const Settings = () => {
  const history = useHistory();

  const [openRefreshRate, setOpenRefreshRate] = useState(false);
  const [openUpAndDownColor, setOpenUpAndDownColor] = useState(false);

  const authStore = useAuthStore();

  return (
    <div>
      <NavBar onBack={() => history.goBack()} className="bg-white mb-2">
        设置
      </NavBar>
      <List className="mb-2">
        <List.Item arrow={<Arrow />} onClick={() => history.push('/change-password')}>
          登錄密碼
        </List.Item>
        <List.Item arrow={<Arrow />} onClick={() => history.push('/account')}>
          修改綁定手機
        </List.Item>
        <List.Item arrow={<Arrow />} onClick={() => history.push('/languages')}>
          更換語言
        </List.Item>
      </List>

      <List className="mb-2">
        <List.Item arrow={<Arrow />} onClick={() => setOpenRefreshRate(true)}>
          刷新频率设置
        </List.Item>
        <List.Item arrow={<Arrow />} onClick={() => setOpenUpAndDownColor(true)}>
          涨跌颜色
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
                authStore.logout();
                Toast.show('退出成功');
                history.replace('/login');
              },
            });
          }}
        >
          <span className="text-[#fe6b1d]">退出登录</span>
        </List.Item>
      </List>

      <RefreshRateList open={openRefreshRate} onClose={() => setOpenRefreshRate(false)} />
      <UpAndDownColorList open={openUpAndDownColor} onClose={() => setOpenUpAndDownColor(false)} />
    </div>
  );
};

export default Settings;
