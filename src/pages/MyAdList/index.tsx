import { Button, Dialog, ErrorBlock, List, Toast } from 'antd-mobile';
import { stringify } from 'query-string';
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
  return (
    <Screen
      headerTitle="我的廣告"
      footer={
        <div className="p-4">
          <Button
            color="primary"
            block
            onClick={() => {
              history.push('/add-ad');
            }}
          >
            添加廣告
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
                      content: data.isOnline === '0' ? '是否確定上架?' : '是否確定下架?',
                      confirmText: '確定',
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
                      content: '確定刪除?',
                      confirmText: '刪除',
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
            description="您暫未發佈廣告～"
          />
        )}
      </div>
    </Screen>
  );
};

export default MyAdList;
