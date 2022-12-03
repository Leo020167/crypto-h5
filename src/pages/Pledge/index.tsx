import { Grid, Input, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useListPledges, usePledgeCommit } from '../../api/endpoints/transformer';
import { PledgeListItem } from '../../api/model';
import { ReactComponent as SvgPledgeHistory } from '../../assets/pledge-history.svg';
import FloatingPanelWithMask from '../../components/FloatingPanelWithMask';
import Screen from '../../components/Screen';

const Pledge = () => {
  const [open, setOpen] = useState(false);
  const { data } = useListPledges();

  const [pledge, setPledge] = useState<PledgeListItem>();
  const [count, setCount] = useState<string>();

  const history = useHistory();
  const pledgeCommit = usePledgeCommit({
    mutation: {
      onSuccess(data) {
        if (data.code === '200') {
          Toast.show(data.msg);
          history.push('/pledge-history');
        }
      },
    },
  });

  return (
    <Screen
      headerTitle="质押生息"
      right={
        <div className="flex justify-end">
          <Link to="/pledge-history">
            <SvgPledgeHistory fontSize={24} />
          </Link>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4">
        {data?.data?.map((v) => (
          <div
            key={v.id}
            className=" h-40 shadow-md shadow-black/5 bg-white rounded-xl px-5 flex flex-col justify-center mb-4"
          >
            <div className="text-[#6175AE] text-lg">{v.symbol}</div>
            <Grid className="mt-2" columns={4}>
              <Grid.Item className="text-center">
                <div className="text-[#A2A9BC] text-xs">最小質押數量</div>
                <div className="text-[#3E4660] text-base">{v.minCount}</div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-[#A2A9BC] text-xs">質押周期</div>
                <div className="text-[#3E4660] text-base">{v.duration}天</div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-[#A2A9BC] text-xs">預計收益</div>
                <div className="text-[#3E4660] text-base">
                  {currency(Number(v.minCount) * Number(v.profitRate) * 0.01, {
                    symbol: '',
                    separator: '',
                  }).format()}
                </div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-[#A2A9BC] text-xs">每日利息</div>
                <div className="text-[#3E4660] text-base">{v.profitRate}</div>
              </Grid.Item>
            </Grid>

            <a
              className="btn-purple mt-4"
              onClick={() => {
                setPledge(v);
                setCount(v.minCount);
                setOpen(true);
              }}
            >
              質押
            </a>
          </div>
        ))}
      </div>

      <FloatingPanelWithMask
        loading={pledgeCommit.isLoading}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          pledgeCommit.mutate({
            data: {
              pledgeId: pledge?.id ?? '',
              count: count ?? '',
            },
          });
        }}
      >
        <div className="px-5">
          <div className="text-black text-base font-bold ">參與質押</div>
          <Grid columns={2} gap={20} className="mt-5">
            <Grid.Item>
              <Card className="flex flex-col items-center justify-center">
                <div className="text-[#6175AE] text-2xl">{pledge?.duration}天</div>
                <div className="text-black text-xs">質押周期</div>
              </Card>
            </Grid.Item>
            <Grid.Item>
              <Card className="flex flex-col items-center justify-center">
                <div className="text-[#6175AE] text-2xl">
                  {currency(Number(count ?? 0) * Number(pledge?.profitRate ?? 0) * 0.01, {
                    symbol: '',
                    separator: '',
                  }).format()}
                  <span className="text-base ml-1">{pledge?.symbol}</span>
                </div>
                <div className="text-black text-xs">預期收益</div>
              </Card>
            </Grid.Item>
          </Grid>

          <div className="mt-5 text-xs flex items-center justify-between">
            <span className="text-[#A2A9BC]">質押數量</span>
            <span className="text-[#6175AE]">
              最小質押數量{pledge?.minCount}
              {pledge?.symbol}
            </span>
          </div>
          <Input
            disabled={pledgeCommit.isLoading}
            type="number"
            min={Number(pledge?.minCount ?? 0)}
            maxLength={18}
            value={count}
            onChange={setCount}
            placeholder="請輸入質押數量"
            className="mt-2.5 bg-[#F6F7F9] h-12 px-5 py-4 text-xl"
          />
        </div>
      </FloatingPanelWithMask>
    </Screen>
  );
};

const Card = styled.div`
  height: 70px;
  background: linear-gradient(180deg, rgba(237, 242, 249, 0.69) 0%, rgba(210, 220, 249, 0.52) 100%);
  border-radius: 4px;
  border: 1px solid #bfc3fc;
`;

export default Pledge;