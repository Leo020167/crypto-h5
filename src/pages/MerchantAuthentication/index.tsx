import { Button, Checkbox, Dialog, List, Toast } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
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

  const intl = useIntl();

  const history = useHistory();
  const { data, refetch } = useOtcGetCertificationInfo({
    query: {
      onSuccess(data) {
        if (data.code === '200') {
          if (data.data?.otcCertification?.idCertify === '0') {
            Dialog.confirm({
              title: intl.formatMessage({ defaultMessage: '未實名不能申請商家認證', id: 'Zg9Cm+' }),
              content: intl.formatMessage({
                defaultMessage: '未實名不能申請商家認證，請實名認證後，在提交商家認證申請。',
                id: 'aOp/5l',
              }),
              confirmText: intl.formatMessage({
                defaultMessage: '前往實名',
                id: 'BO7t+j',
              }),
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
            {intl.formatMessage({
              defaultMessage: '申請商家認證',
              id: 'pHNoba',
            })}
          </Button>
        );
      case '1':
        return (
          <Button block color="primary" className="mt-10" disabled>
            {intl.formatMessage({
              defaultMessage: '認證中',
              id: 'b5Yvc8',
            })}
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
                content: intl.formatMessage({
                  defaultMessage: '確定申請取消商家認證？',
                  id: 'yGpmXF',
                }),
                confirmText: intl.formatMessage({
                  defaultMessage: '確定',
                  id: 'ofc1Jv',
                }),
                onConfirm() {
                  cancel.mutate();
                },
              });
            }}
          >
            {intl.formatMessage({
              defaultMessage: '申請取消商家認證',
              id: '7IlbnR',
            })}
          </Button>
        );
      case '3':
        return (
          <Button block color="primary" className="mt-10" disabled>
            {intl.formatMessage({
              defaultMessage: '正在申請取消商家認證',
              id: 'XJfx+x',
            })}
          </Button>
        );

      default:
        return null;
    }
  }, [authenticate, cancel, intl, sign, state]);

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
    <Screen
      headerTitle={intl.formatMessage({
        defaultMessage: '商家認證',
        id: 'O3jk1+',
      })}
    >
      <Container className="px-4">
        {reason}
        <div className=" h-16 flex items-center">
          <span className="flex-1 text-base text-[#1A1717] font-bold">
            {intl.formatMessage({
              defaultMessage: '實名信息',
              id: 'qxIFeG',
            })}
          </span>
          <span className="text-[#6175AE]">
            {isAuthentication
              ? intl.formatMessage({
                  defaultMessage: '已實名',
                  id: 'HBqJuk',
                })
              : intl.formatMessage({
                  defaultMessage: '未實名',
                  id: 'LOwS8B',
                })}
          </span>
        </div>
        <List>
          <List.Item
            title={intl.formatMessage({
              defaultMessage: '姓名',
              id: '+4lD9e',
            })}
            extra={(isAuthentication && otcCertification?.realName) || '--'}
          />
          <List.Item
            title={intl.formatMessage({
              defaultMessage: '證件號碼',
              id: '92MTUG',
            })}
            extra={(isAuthentication && otcCertification?.certNo) || '--'}
          />
          <List.Item
            title={intl.formatMessage({
              defaultMessage: '保證金',
              id: 'brzlNv',
            })}
            className="border-b border-[#eeeeee]"
            extra={((isAuthentication && otcCertification?.securityDeposit) || '--') + ' USDT'}
          />
        </List>
        <div className="text-[#9A9A9A] text-xs mt-4">
          {intl.formatMessage({
            defaultMessage:
              '保證金用於發佈出售或購買USDT廣告，提交認證信息即時從資產餘額中進行凍結。',
            id: 'QQdpxX',
          })}
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
              {intl.formatMessage({
                defaultMessage: '同意凍結',
                id: 'gVKoa9',
              })}
              <span className="text-[#6175ae]">{otcCertification?.securityDeposit} USDT</span>

              {intl.formatMessage({
                defaultMessage: '作為廣告方保證資產，且同意',
                id: 'wzY6eO',
              })}
              <a
                href="/procoin/article/#/passgeDetail?article_id=48"
                target="__blank"
                className="text-[#6175ae]"
              >
                {intl.formatMessage({
                  defaultMessage: '《商家服務協議》',
                  id: 'lgUZ5i',
                })}
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
