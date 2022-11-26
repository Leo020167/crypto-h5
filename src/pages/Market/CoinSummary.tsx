const properties = [
  { key: 'name', label: '名稱' },
  { key: 'issueDate', label: '報價貨幣' },
  { key: 'issueAmount', label: '合約份數' },
  { key: 'circulateAmount', label: '保證金比例' },
  { key: 'crowdfundPrice', label: '最小波動值' },
  { key: 'whitePaperUrl', label: '最小波動盈虧' },
  { key: 'officialWebUrl', label: '手續費' },
  { key: 'blockUrl', label: '買入點差' },
];

const CoinSummary = ({ coin }: { coin?: any }) => {
  return (
    <div className="text-gray-400 text-xs divide-y divide-black">
      {properties.map((p) => (
        <div className="flex items-center justify-between h-14 px-4" key={p.key}>
          <span>{p.label}</span>
          <span className="text-gray-300">{coin?.[p.key] || '----'}</span>
        </div>
      ))}

      <div>
        <div className="text-base px-4 my-4">簡介:</div>
        <div className="px-4 mt-4 text-gray-300">{coin['desc']}</div>
      </div>
    </div>
  );
};

export default CoinSummary;
