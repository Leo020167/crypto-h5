import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export const useSubscribeState = () => {
  const intl = useIntl();
  const stateHash: { [key: string]: { label: string; color: string; button: string } } = useMemo(
    () => ({
      '0': {
        label: intl.formatMessage({ defaultMessage: '未開始', id: 'IudShd' }),
        button: intl.formatMessage({ defaultMessage: '預熱中', id: 'CBgsGP' }),
        color: '#00AD88',
      },
      '1': {
        label: intl.formatMessage({ defaultMessage: '申購中', id: 'sbEmQh' }),
        button: intl.formatMessage({ defaultMessage: '申購', id: 'FLp81s' }),
        color: '#5FCE64',
      },
      '2': {
        label: intl.formatMessage({ defaultMessage: '已結束', id: 'IRtvek' }),
        button: intl.formatMessage({ defaultMessage: '已結束', id: 'IRtvek' }),
        color: '#a6a6a6',
      },
    }),
    [intl],
  );

  return stateHash;
};
