import { Checkbox, Grid } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { AccountInfo } from '../../api/model';

interface HomeBalanceAccountProps {
  account?: AccountInfo;
}
const HomeBalanceAccount = ({ account }: HomeBalanceAccountProps) => {
  const [hidden0Assets, setHidden0Assets] = useState(false);

  const assets = useMemo(() => {
    const symbols = account?.symbolList ?? [];

    if (hidden0Assets) {
      return symbols.filter((v) => Number(v.holdAmount) > 0 || Number(v.frozenAmount) > 0);
    }

    return symbols;
  }, [account?.symbolList, hidden0Assets]);

  const intl = useIntl();

  return (
    <Container className="bg-gray-100">
      <div className="bg-white p-4">
        <div className="text-gray-400">
          {intl.formatMessage({ defaultMessage: '餘額賬戶總資產(USDT)', id: 'dKX04w' })}
        </div>
        <div className="mt-1 text-xs">
          <span className="text-[#c1d3155]">{account?.assets ?? '0'}</span>
          <span className="ml-1">{account?.assetsCny ?? '≈HK$0.00'}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
          <div>
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '可用(USDT)', id: 'ntWvUZ' })}
            </div>
            <div>{account?.holdAmount ?? '0'}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-400">
              {intl.formatMessage({ defaultMessage: '凍結(USDT)', id: 'Rx1AtW' })}
            </div>
            <div>{account?.frozenAmount ?? '0'}</div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between bg-white p-4 text-xs">
          <Checkbox checked={hidden0Assets} onChange={setHidden0Assets}>
            {intl.formatMessage({ defaultMessage: '隐藏0资产', id: 'XddKO7' })}
          </Checkbox>
        </div>
        {assets.map((v) => (
          <div className="mb-2 bg-white p-4" key={v.symbol}>
            <div>
              <span className="text-sm font-bold text-[#6175ae]">{v.symbol}</span>
            </div>
            <Grid columns={3} className="mt-2.5 text-xs">
              <Grid.Item>
                <div className="text-[#A2A9BC]">
                  {intl.formatMessage({ defaultMessage: '可用資產', id: 'KC9/eD' })}
                </div>
                <div className="mt-1 text-[#3E4660]">{v.holdAmount}</div>
              </Grid.Item>
              <Grid.Item className="text-center">
                <div className="text-[#A2A9BC]">
                  {intl.formatMessage({ defaultMessage: '凍結', id: 'uwCp/4' })}
                </div>
                <div className="mt-1 text-[#3E4660]">{v.frozenAmount}</div>
              </Grid.Item>
              <Grid.Item className="text-right">
                <div className="text-[#A2A9BC]">
                  {intl.formatMessage({ defaultMessage: '折合(USDT)', id: 'P+t8ta' })}
                </div>
                <div className="mt-1 text-[#3E4660]">{v.usdtAmount}</div>
              </Grid.Item>
            </Grid>
          </div>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-checkbox {
    --icon-size: 14px;
    --font-size: 12px;
    --gap: 6px;
  }
`;

export default HomeBalanceAccount;
