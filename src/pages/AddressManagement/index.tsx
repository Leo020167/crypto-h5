import { Dialog, Toast } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import md5 from 'js-md5';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAddressList, useDelAddress } from '../../api/endpoints/transformer';
import { ReactComponent as SvgTrash } from '../../assets/trash.svg';
import PaymentPasswordDialog from '../../components/PaymentPasswordDialog';
import Screen from '../../components/Screen';

const AddressManagement = () => {
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
      headerTitle="提幣地址管理"
      right={
        <div className="flex justify-end">
          <Link to="/address-management/add">
            <AddOutline fontSize={24} color="#333" />
          </Link>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        <div className="text-[#3E4660] text-sm mb-4">我的提幣地址</div>

        {data?.data?.map((v) => (
          <div
            key={v.id}
            className=" bg-white rounded-lg shadow-md shadow-black/5 px-5 py-4 flex items-center"
          >
            <div className="flex-1 flex flex-col min-w-0">
              <div className="text-[#6175AE] text-lg flex items-center justify-between">
                <span>{v.symbol}</span>
                <a
                  onClick={() => {
                    Dialog.confirm({
                      content: '確定刪除該地址嗎？',
                      confirmText: '刪除',
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

              <div className="text-[#A2A9BC] text-xs mt-1 break-words">{v.address}</div>

              <div className="text-[#A2A9BC] mt-2">
                備注
                <span className="text-[#3E4660] ml-1">{v.remark}</span>
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
