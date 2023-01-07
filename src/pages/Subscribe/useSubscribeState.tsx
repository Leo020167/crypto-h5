import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export const useSubscribeState = () => {
  const intl = useIntl();
  const stateHash: { [key: string]: { label: string; color: string; button: string } } = useMemo(
    () => ({
      '0': {
        label: intl.formatMessage({ defaultMessage: '待開始', id: 'Jf8sT5' }),
        button: intl.formatMessage({ defaultMessage: '待開始', id: 'Jf8sT5' }),
        color: '#a6a6a6',
      },
      '1': {
        label: intl.formatMessage({ defaultMessage: '進行中', id: '+JdgDW' }),
        button: intl.formatMessage({ defaultMessage: '立即參與', id: 'ZsNueb' }),
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
