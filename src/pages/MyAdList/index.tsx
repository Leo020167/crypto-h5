import { Button, Dialog, ErrorBlock, List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  useOtcDelMyAd,
  useOtcFindMyAdList,
  useOtcSetOnline,
} from '../../api/endpoints/transformer';
import { AdItem } from '../../api/model';
import ic_my_ad_no_data from '../../assets/ic_my_ad_no_data.png';
import Screen from '../../components/Screen';
import AdListItem from './AdListItem';

const MyAdList = () => {
  const history = useHistory();
  const { data, refetch } = useOtcFindMyAdList();

  const adList = data?.data?.myAdList ?? [];

  const otcSetOnline = useOtcSetOnline({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });
  const otcDelMyAd = useOtcDelMyAd({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  const intl = useIntl();

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '我的廣告', id: '64eliW' })}
      footer={
        <div className="p-4">
          <Button
            color="primary"
            block
            onClick={() => {
              history.push('/add-ad');
            }}
          >
            {intl.formatMessage({ defaultMessage: '添加廣告', id: 'ASHrJh' })}
          </Button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto">
        {adList.length ? (
          <List>
            {adList.map((v) => (
              <List.Item key={v.adId}>
                <AdListItem
                  data={v}
                  onSetOnline={(data: AdItem) => {
                    Dialog.confirm({
                      content:
                        data.isOnline === '0'
                          ? intl.formatMessage({ defaultMessage: '是否確定上架?', id: 'HmiIeC' })
                          : intl.formatMessage({ defaultMessage: '是否確定下架?', id: '8Jc445' }),
                      cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
                      confirmText: intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' }),
                      onConfirm() {
                        otcSetOnline.mutate({
                          data: {
                            adId: data.adId,
                            online: data.isOnline === '0' ? '1' : '0',
                          },
                        });
                      },
                    });
                  }}
                  onEdit={(data) => {
                    history.push({ pathname: '/add-ad', search: stringify({ adId: data.adId }) });
                  }}
                  onDelete={(data: AdItem) => {
                    Dialog.confirm({
                      content: intl.formatMessage({ defaultMessage: '確定刪除?', id: '/7LMEm' }),
                      cancelText: intl.formatMessage({ defaultMessage: '取消', id: '2QzYmY' }),
                      confirmText: intl.formatMessage({ defaultMessage: '刪除', id: 'oAdm61' }),
                      onConfirm() {
                        otcDelMyAd.mutate({
                          data: {
                            adId: data.adId,
                          },
                        });
                      },
                    });
                  }}
                />
              </List.Item>
            ))}
          </List>
        ) : (
          <ErrorBlock
            className="mt-20"
            image={ic_my_ad_no_data}
            status="empty"
            title=""
            description={intl.formatMessage({ defaultMessage: '您暫未發佈廣告～', id: 'R0bpcH' })}
          />
        )}
      </div>
    </Screen>
  );
};

export default MyAdList;
