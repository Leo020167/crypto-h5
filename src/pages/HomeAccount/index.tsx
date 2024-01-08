import { useAtomValue } from 'jotai';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import { useHomeAccount } from '../../api/endpoints/transformer';
import { darkModeAtom } from '../../atoms';
import HomeSpotAccount from './HomeSpotAccount';

const HomeAccount = () => {
  const { data, refetch } = useHomeAccount();

  const intl = useIntl();

  useInterval(() => refetch(), 1000);

  const mode = useAtomValue(darkModeAtom);

  return (
    <Container className="relative flex h-screen min-h-0 flex-col bg-gray-100 dark:bg-[#161720]">
      <div className="flex-1 overflow-y-auto">
        <div
          className={`flex flex-col bg-[#4D4CE6] px-4 pb-6 pt-10 text-white ${
            mode === 'dark' ? 'dark-background' : ''
          }`}
        >
          <div className="text-xs text-gray-200">
            {intl.formatMessage({ defaultMessage: '餘額賬戶總資產(USDT)', id: 'dKX04w' })}
          </div>
          <div className=" my-1 text-4xl font-bold">{data?.data?.tolAssets ?? '0.00'}</div>
          <div className="text-base">{data?.data?.tolAssetsCny ?? '0.00'}</div>

          <div className="mt-4 flex gap-2">
            <Link
              to="/recharge-coin"
              className="flex h-full min-h-[40px] flex-1 items-center justify-center rounded bg-[#6f6fe7] px-2 dark:bg-[#6175AE]"
            >
              {intl.formatMessage({ defaultMessage: '充幣', id: 'kGK1/L' })}
            </Link>
            <Link
              to="/take-coin"
              className="flex h-full min-h-[40px] flex-1 items-center justify-center rounded bg-[#6f6fe7] px-2 dark:bg-[#6175AE]"
            >
              {intl.formatMessage({ defaultMessage: '提幣', id: 'andeZs' })}
            </Link>
          </div>
        </div>

        <HomeSpotAccount account={data?.data?.spotAccount} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-tabs {
    --adm-font-size-9: 14px;
    --adm-color-primary: #4d4ce6;
    --active-line-height: 4px;
    --active-line-border-radius: 0;
    color: #666175ae;
    font-weight: bold;
  }

  .dark-background {
    background: linear-gradient(252deg, #6175ae 0%, rgba(97, 117, 174, 0.15) 99%);
  }
`;

export default HomeAccount;
