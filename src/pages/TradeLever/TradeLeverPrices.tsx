const TradeLeverPrices = () => {
  return (
    <div className="text-xs">
      <div className="text-[#bebebe] flex items-center">
        <span className="flex-1">價格</span>
        <span className="flex-1 ml-4">數量(手)</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span>----</span>
          <span className="mr-4 text-[#969696]">----</span>
        </div>
      </div>
      <div className="text-[#00ad88] text-base font-bold">0.00000000</div>
      <div className="text-[#d6d6d6]">≈HK$0.00</div>

      <div className="mt-4"></div>
    </div>
  );
};

export default TradeLeverPrices;
