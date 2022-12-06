import { useMemo } from 'react';
import { useIntl } from 'react-intl';

const CoinSummary = ({ coin }: { coin?: any }) => {
  const intl = useIntl();
  const properties = useMemo(
    () => [
      { key: 'name', label: intl.formatMessage({ defaultMessage: '名稱', id: 'ZU9FqB' }) },
      { key: 'issueDate', label: intl.formatMessage({ defaultMessage: '報價貨幣', id: 'SaqkUp' }) },
      {
        key: 'issueAmount',
        label: intl.formatMessage({ defaultMessage: '合約份數', id: 'iCZI8W' }),
      },
      {
        key: 'circulateAmount',
        label: intl.formatMessage({ defaultMessage: '保證金比例', id: '297aFF' }),
      },
      {
        key: 'crowdfundPrice',
        label: intl.formatMessage({ defaultMessage: '最小波動值', id: 'etRUXu' }),
      },
      {
        key: 'whitePaperUrl',
        label: intl.formatMessage({ defaultMessage: '最小波動盈虧', id: 'jnrXEJ' }),
      },
      {
        key: 'officialWebUrl',
        label: intl.formatMessage({ defaultMessage: '手續費', id: 'UXyFaa' }),
      },
      { key: 'blockUrl', label: intl.formatMessage({ defaultMessage: '買入點差', id: 'anbdi0' }) },
    ],
    [intl],
  );
  return (
    <div className="text-gray-400 text-xs divide-y divide-black">
      {properties.map((p) => (
        <div className="flex items-center justify-between h-14 px-4" key={p.key}>
          <span>{p.label}</span>
          <span className="text-gray-300">{coin?.[p.key] || '----'}</span>
        </div>
      ))}

      <div>
        <div className="text-base px-4 my-4">
          {intl.formatMessage({ defaultMessage: '簡介:', id: 'StIa2l' })}
        </div>
        <div className="px-4 mt-4 text-gray-300">{coin['desc']}</div>
      </div>
    </div>
  );
};

export default CoinSummary;
