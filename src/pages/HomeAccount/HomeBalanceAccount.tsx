import { AccountInfo } from '../../api/model';

interface HomeBalanceAccountProps {
  account?: AccountInfo;
}
const HomeBalanceAccount = ({ account }: HomeBalanceAccountProps) => {
  return (
    <div className="p-4">
      <div className="text-gray-400">餘額賬戶總資產(USDT)</div>
      <div className="mt-1 text-xs">
        <span className="text-[#c1d3155]">{account?.assets ?? '0'}</span>
        <span className="ml-1">{account?.assetsCny ?? '≈HK$0.00'}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[#c1d3155]">
        <div>
          <div className="text-gray-400">可用(USDT)</div>
          <div>{account?.holdAmount ?? '0'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400">凍結(USDT)</div>
          <div>{account?.frozenAmount ?? '0'}</div>
        </div>
      </div>
    </div>
  );
};

export default HomeBalanceAccount;
