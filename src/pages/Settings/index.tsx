import { Dialog, List, NavBar, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useHomeMy } from '../../api/endpoints/transformer';

import { ReactComponent as Arrow } from '../../assets/ic_svg_arrow_2.svg';
import { useAuthStore } from '../../stores/auth';
import RefreshRateList from './RefreshRateList';
import UpAndDownColorList from './UpAndDownColorList';

const Settings = () => {
  const history = useHistory();

  const [openRefreshRate, setOpenRefreshRate] = useState(false);
  const [openUpAndDownColor, setOpenUpAndDownColor] = useState(false);

  const authStore = useAuthStore();

  const { data: homeMy } = useHomeMy();

  const intl = useIntl();

  return (
    <div>
      <NavBar onBack={() => history.goBack()} className="mb-2 bg-white">
        {intl.formatMessage({ defaultMessage: '设置', id: 'xE1H+X' })}
      </NavBar>
      <List className="mb-2">
        <List.Item arrow={<Arrow />} onClick={() => history.push('/change-password')}>
          {intl.formatMessage({ defaultMessage: '登錄密碼', id: '958kN+' })}
        </List.Item>
        <List.Item
          arrow={<Arrow />}
          onClick={() => {
            if (authStore.userInfo?.phone) {
              history.push('/account');
            } else {
              history.push('/bind-phone');
            }
          }}
        >
          {intl.formatMessage({ defaultMessage: '綁定手機', id: 'VT023k' })}
        </List.Item>
        <List.Item
          arrow={<Arrow />}
          onClick={() => {
            if (authStore.userInfo?.phone) {
              history.push('/setting-pay-password');
            } else {
              history.push('/bind-phone');
            }
          }}
        >
          {intl.formatMessage({ defaultMessage: '設置交易密碼', id: 'obugXD' })}
        </List.Item>
        <List.Item arrow={<Arrow />} onClick={() => history.push('/languages')}>
          {intl.formatMessage({ defaultMessage: '更換語言', id: 'WrleG5' })}
        </List.Item>
      </List>

      <List className="mb-2">
        <List.Item arrow={<Arrow />} onClick={() => setOpenRefreshRate(true)}>
          {intl.formatMessage({ defaultMessage: '刷新频率设置', id: 'E7wFmB' })}
        </List.Item>
        <List.Item arrow={<Arrow />} onClick={() => setOpenUpAndDownColor(true)}>
          {intl.formatMessage({ defaultMessage: '涨跌颜色', id: 'o3hkNu' })}
        </List.Item>
      </List>
      <List className="mb-2">
        <List.Item
          arrow={<Arrow />}
          onClick={() => {
            if (homeMy?.data?.aboutUsUrl) {
              window.open(homeMy?.data?.aboutUsUrl);
            }
          }}
        >
          {intl.formatMessage({ defaultMessage: '关于我们', id: '7KOsNC' })}
        </List.Item>
      </List>
      <List className="mb-2">
        <List.Item
          arrow={null}
          className="text-center "
          onClick={() => {
            Dialog.confirm({
              title: intl.formatMessage({ defaultMessage: '注销', id: 'pecEGk' }),
              content: intl.formatMessage({ defaultMessage: '你确定要注销吗?', id: '6jT3zt' }),
              cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
              confirmText: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
              onConfirm() {
                authStore.logout();
                Toast.show(intl.formatMessage({ defaultMessage: '退出成功', id: 'GVXj0E' }));
                history.replace('/login');
              },
            });
          }}
        >
          <span className="text-[#fe6b1d]">
            {intl.formatMessage({ defaultMessage: '退出登录', id: 'B+YBvr' })}
          </span>
        </List.Item>
      </List>

      <RefreshRateList open={openRefreshRate} onClose={() => setOpenRefreshRate(false)} />
      <UpAndDownColorList open={openUpAndDownColor} onClose={() => setOpenUpAndDownColor(false)} />
    </div>
  );
};

export default Settings;
