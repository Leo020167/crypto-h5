import { Button, Grid, Input, Toast } from 'antd-mobile';
import currency from 'currency.js';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
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

  const intl = useIntl();

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '质押生息', id: 'WKYPpM' })}
      right={
        <div className="flex justify-end ">
          <Link to="/pledge-history" className="dark:text-[#0BBB79]">
            <SvgPledgeHistory fontSize={24} />
          </Link>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto bg-[#F4F6F4] p-4 dark:bg-[#161720]">
        {data?.data?.map((v) => (
          <div
            key={v.id}
            className=" mb-4 flex h-40 flex-col justify-center rounded-xl bg-white px-5 shadow-md shadow-black/5 dark:bg-[#2A2E38]"
          >
            <div className="text-lg text-[#6175AE] dark:text-white">{v.symbol}</div>
            <Grid className="mt-2" columns={4}>
              <Grid.Item className="text-center">
                <div className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
                  {intl.formatMessage({ defaultMessage: '最小質押數量', id: 'GDglvI' })}
                </div>
                <div className="text-base text-[#3E4660] dark:text-white">{v.minCount}</div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
                  {intl.formatMessage({ defaultMessage: '質押周期', id: 'xwo0Ao' })}
                </div>
                <div className="text-base text-[#3E4660] dark:text-white">
                  {v.duration}
                  {intl.formatMessage({ defaultMessage: '天', id: '0B0jPm' })}
                </div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
                  {intl.formatMessage({ defaultMessage: '預計收益', id: '/slM7z' })}
                </div>
                <div className="text-base text-[#3E4660] dark:text-white">
                  {currency(Number(v.minCount) * Number(v.profitRate) * 0.01, {
                    symbol: '',
                    separator: '',
                  }).format()}
                </div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-xs text-[#A2A9BC] dark:text-[#AAAAAA]">
                  {intl.formatMessage({ defaultMessage: '每日利息', id: '/T0l4z' })}
                </div>
                <div className="text-base text-[#3E4660] dark:text-white">{v.profitRate}%</div>
              </Grid.Item>
            </Grid>

            <div className="mt-4">
              <Button
                color="primary"
                block
                onClick={() => {
                  setPledge(v);
                  setCount(v.minCount);
                  setOpen(true);
                }}
              >
                {intl.formatMessage({ defaultMessage: '質押', id: '161suA' })}
              </Button>
            </div>
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
          <div className="text-base font-bold text-black dark:text-white">
            {intl.formatMessage({ defaultMessage: '參與質押', id: 'PA9DRl' })}
          </div>
          <Grid columns={2} gap={20} className="mt-5">
            <Grid.Item>
              <div className="pledge-card flex flex-col items-center justify-center">
                <div className="text-2xl text-[#6175AE] dark:text-white">
                  {pledge?.duration}
                  {intl.formatMessage({ defaultMessage: '天', id: '0B0jPm' })}
                </div>
                <div className="text-xs text-black dark:text-[#AAAAAA]">
                  {intl.formatMessage({ defaultMessage: '質押周期', id: 'xwo0Ao' })}
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="pledge-card flex flex-col items-center justify-center">
                <div className="text-2xl text-[#6175AE] dark:text-white">
                  {currency(Number(count ?? 0) * Number(pledge?.profitRate ?? 0) * 0.01, {
                    symbol: '',
                    separator: '',
                  }).format()}
                  <span className="ml-1 text-base">{pledge?.symbol}</span>
                </div>
                <div className="text-xs text-black dark:text-[#AAAAAA]">
                  {intl.formatMessage({ defaultMessage: '預期收益', id: 'yZDfS/' })}
                </div>
              </div>
            </Grid.Item>
          </Grid>

          <div className="mt-5 flex items-center justify-between text-xs">
            <span className="text-[#A2A9BC] dark:text-[#AAAAAA]">
              {intl.formatMessage({ defaultMessage: '質押數量', id: 'mjDNUB' })}
            </span>
            <span className="text-[#6175AE] dark:text-white">
              {intl.formatMessage({ defaultMessage: '最小質押數量', id: 'GDglvI' })}
              {pledge?.minCount}
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
            placeholder={intl.formatMessage({ defaultMessage: '請輸入質押數量', id: 'EVLNlH' })}
            className="mt-2.5 h-12 bg-[#F6F7F9] px-5 py-4 text-xl"
          />
        </div>
      </FloatingPanelWithMask>
    </Screen>
  );
};

export default Pledge;
