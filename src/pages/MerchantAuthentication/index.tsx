import { Button, Checkbox, Dialog, List, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  useOtcCertificationApplyForCancellation,
  useOtcCertificationAuthenticate,
  useOtcGetCertificationInfo,
} from '../../api/endpoints/transformer';
import { ReactComponent as SvgAlert } from '../../assets/ic_svg_alert.svg';
import Screen from '../../components/Screen';

/**
 * 商家認證
 * @returns
 */
const MerchantAuthentication = () => {
  const [sign, setSign] = useState(false);

  const history = useHistory();
  const { data, refetch } = useOtcGetCertificationInfo({
    query: {
      onSuccess(data) {
        if (data.code === '200') {
          if (data.data?.otcCertification?.idCertify === '0') {
            Dialog.confirm({
              title: '未實名不能申請商家認證',
              content: '未未實名不能申請商家認證，請實名認證後，在提交商家認證申請。',
              confirmText: '前往實名',
              onConfirm() {
                history.replace('/verified');
              },
            });
          }
        }
      },
    },
  });

  const otcCertification = data?.data?.otcCertification;
  const state = otcCertification?.state ?? '';
  const isAuthentication = otcCertification?.idCertify === '1';

  const authenticate = useOtcCertificationAuthenticate({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  const cancel = useOtcCertificationApplyForCancellation({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  const button = useMemo(() => {
    switch (state) {
      case '0':
      case '4':
      case '-1':
        return (
          <Button
            block
            color="primary"
            className="mt-10"
            disabled={!sign}
            loading={authenticate.isLoading}
            onClick={() => {
              authenticate.mutate();
            }}
          >
            申請商家認證
          </Button>
        );
      case '1':
        return (
          <Button block color="primary" className="mt-10" disabled>
            認證中
          </Button>
        );
      case '2':
        return (
          <Button
            block
            color="primary"
            className="mt-10"
            onClick={() => {
              Dialog.confirm({
                content: '確定申請取消商家認證？',
                confirmText: '確定',
                onConfirm() {
                  cancel.mutate();
                },
              });
            }}
          >
            申請取消商家認證
          </Button>
        );
      case '3':
        return (
          <Button block color="primary" className="mt-10" disabled>
            正在申請取消商家認證
          </Button>
        );

      default:
        return null;
    }
  }, [authenticate, cancel, sign, state]);

  const reason = useMemo(() => {
    if (state === '-1' && otcCertification?.reason) {
      return (
        <div className="flex items-center h-10">
          <SvgAlert />
          <span className="ml-2 text-[#6175AE] text-xs">{otcCertification?.reason}</span>
        </div>
      );
    }
    return null;
  }, [otcCertification?.reason, state]);

  return (
    <Screen headerTitle="商家認證">
      <Container className="px-4">
        {reason}
        <div className=" h-16 flex items-center">
          <span className="flex-1 text-base text-[#1A1717] font-bold">實名信息</span>
          <span className="text-[#6175AE]">{isAuthentication ? '已實名' : '未實名'}</span>
        </div>
        <List>
          <List.Item
            title="姓名"
            extra={(isAuthentication && otcCertification?.realName) || '--'}
          />
          <List.Item
            title="證件號碼"
            extra={(isAuthentication && otcCertification?.certNo) || '--'}
          />
          <List.Item
            title="保證金"
            className="border-b border-[#eeeeee]"
            extra={((isAuthentication && otcCertification?.securityDeposit) || '--') + ' USDT'}
          />
        </List>
        <div className="text-[#9A9A9A] text-xs mt-4">
          保證金用於發佈出售或購買USDT廣告，提交認證信息即時從資產餘額中進行凍結。
        </div>

        {['0', '4', '-1'].includes(state) && (
          <div className=" mt-10 flex items-start text-xs">
            <Checkbox
              checked={sign}
              onChange={setSign}
              className="mt-0.5 mr-2"
              style={{
                '--icon-size': '14px',
                '--font-size': '12px',
                '--gap': '6px',
              }}
            />
            <div>
              同意凍結
              <span className="text-[#6175ae]">{otcCertification?.securityDeposit} USDT</span>
              作為廣告方保證資產，且同意
              <a
                href="/procoin/article/#/passgeDetail?article_id=48"
                target="__blank"
                className="text-[#6175ae]"
              >
                《商家服務協議》
              </a>
            </div>
          </div>
        )}

        {button}
      </Container>
    </Screen>
  );
};

const Container = styled.div`
  .adm-list-item {
    padding-left: 0;
  }

  .adm-list-item-content-extra {
    color: #1a1717;
    font-size: 14px;
  }
`;

export default MerchantAuthentication;
