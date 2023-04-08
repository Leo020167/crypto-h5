import { Dialog, Toast } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import md5 from 'js-md5';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useAddressList, useDelAddress } from '../../api/endpoints/transformer';
import { ReactComponent as SvgTrash } from '../../assets/trash.svg';
import PaymentPasswordDialog from '../../components/PaymentPasswordDialog';
import Screen from '../../components/Screen';

const AddressManagement = () => {
  const intl = useIntl();

  const { data, refetch } = useAddressList({});

  const delAddress = useDelAddress({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          setOpen(false);
          setId(undefined);
          Toast.show(data.msg);
          refetch();
        }
      },
    },
  });

  const [id, setId] = useState<string>();
  const [open, setOpen] = useState(false);

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '提幣地址管理', id: 'OTiy6F' })}
      right={
        <div className="flex justify-end">
          <Link to="/addresses/add">
            <AddOutline fontSize={24} color="#333" />
          </Link>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="mb-4 text-sm text-[#3E4660]">
          {intl.formatMessage({ defaultMessage: '我的提幣地址', id: '7rLwaw' })}
        </div>

        {data?.data?.map((v) => (
          <div
            key={v.id}
            className=" mb-4 flex items-center rounded-lg bg-white px-5 py-4 shadow-md shadow-black/5"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between text-lg text-[#6175AE]">
                <span>{v.symbol}</span>
                <a
                  onClick={() => {
                    Dialog.confirm({
                      content: intl.formatMessage({
                        defaultMessage: '確定刪除該地址嗎？',
                        id: 'BxvrdK',
                      }),
                      confirmText: intl.formatMessage({
                        defaultMessage: '刪除',
                        id: 'oAdm61',
                      }),
                      onConfirm() {
                        setId(v.id);
                        setOpen(true);
                      },
                    });
                  }}
                >
                  <SvgTrash />
                </a>
              </div>

              <div className="mt-1 break-words text-xs text-[#A2A9BC]">{v.address}</div>

              <div className="mt-2 text-[#A2A9BC]">
                {intl.formatMessage({
                  defaultMessage: '備注',
                  id: 'Be30m1',
                })}
                <span className="ml-1 text-[#3E4660]">{v.remark}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaymentPasswordDialog
        open={open}
        onClose={() => setOpen(false)}
        onFill={(value) => {
          delAddress.mutate({
            data: {
              addressId: id ?? '',
              payPass: md5(value),
            },
          });
        }}
      />
    </Screen>
  );
};

export default AddressManagement;
