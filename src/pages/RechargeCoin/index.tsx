import { Button, NavBar, Selector, Toast } from 'antd-mobile';
import { useAtomValue } from 'jotai';
import { first } from 'lodash-es';
import { stringify } from 'query-string';
import { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import styled from 'styled-components';
import { useDepositWithdrawGetInfo } from '../../api/endpoints/transformer';
import { userAtom } from '../../atoms';

const download = (image: string) => {
  const element = document.createElement('a');
  const file = new Blob([image], { type: 'image/*' });
  element.href = URL.createObjectURL(file);
  element.download = 'image.jpg';
  element.click();
};

const RechargeCoin = () => {
  const history = useHistory();

  const user = useAtomValue(userAtom);

  const [selected, setSelected] = useState<string[]>([]);

  const { data } = useDepositWithdrawGetInfo(
    { userId: user?.userId },
    {
      query: {
        enabled: !!user?.userId,
        onSuccess(data) {
          if (data.data?.infos) {
            setSelected([data.data?.infos[0].type ?? '']);
          }
        },
      },
    },
  );

  const items = useMemo(() => data?.data?.infos ?? [], [data?.data?.infos]);

  const options = useMemo(
    () =>
      items.map((v) => ({
        value: v.type ?? '',
        label: v.type ? 'USDT-' + v.type : '--',
      })) ?? [],
    [items],
  );

  const selectedItem = useMemo(
    () => first(items.filter((v) => selected.includes(v.type ?? ''))),
    [items, selected],
  );

  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <Container className="h-screen bg-white relative">
      <NavBar
        onBack={() => history.goBack()}
        className="mb-4"
        right={<Link to="/take-coin-history">记录</Link>}
      >
        充币
      </NavBar>

      <div className="px-4">
        <div className="bg-[#f8faf9] h-14 text-[#989a99] text-lg px-4 flex items-center rounded">
          USDT
        </div>
        <div className="mt-4">
          <div className="text-[#1D3155]">充值网络</div>
          <Selector
            className="mt-2"
            columns={3}
            showCheckMark={false}
            options={options}
            value={selected}
            onChange={setSelected}
          />
        </div>

        <div className="mt-4 bg-[#f7f8fa] flex flex-col items-center justify-center p-5">
          <div className="w-32 h-32">
            {selectedItem?.image && (
              <img alt="" src={selectedItem?.image} className="w-full h-full" />
            )}
          </div>
          <a
            className="px-4 py-1 rounded bg-[#e4e5e9] text-[#6175AE] mt-4"
            onClick={() => {
              if (selectedItem?.image && selectedItem.address) {
                download(selectedItem.image);
              }
            }}
          >
            保存二维码
          </a>

          <div className="mt-4 w-full flex text-[#666175AE]">充币地址</div>
          <span className="mt-4 text-xs text-[#6175AE]">{selectedItem?.address}</span>
          <div className="mt-4 w-full flex">
            <div
              className="px-4 py-1 rounded bg-[#e4e5e9] text-[#6175AE]"
              onClick={() => {
                if (selectedItem?.address) {
                  copyToClipboard(selectedItem?.address);
                  Toast.show('已複製到粘貼板');
                }
              }}
            >
              复制
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <Button
          size="large"
          color="primary"
          block
          className="rounded-none"
          onClick={() => history.push(`/recharge?${stringify({ chainType: selectedItem?.type })}`)}
        >
          充值
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-selector-item {
    border: 1px solid #cccccc;

    color: #cccccc;
    background-color: transparent;
    &.adm-selector-item-active {
      border-color: #6175ae;
      color: #6175ae;
    }
  }
`;

export default RechargeCoin;
