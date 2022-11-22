import { Popover } from 'antd-mobile';
import { useMemo } from 'react';
import styled from 'styled-components';
import { useOtcConfig } from '../../api/endpoints/transformer';

interface OptionalCurrenciesProps {
  value?: string;
  onChange?: (value: string) => void;
}
const OptionalCurrencies = ({ value, onChange }: OptionalCurrenciesProps) => {
  const { data: otcConfig } = useOtcConfig();

  const actions = useMemo(
    () => otcConfig?.data?.currencies?.map((v) => ({ key: v, text: v })) ?? [],
    [otcConfig?.data?.currencies],
  );

  return (
    <Container
      actions={actions}
      placement="bottom-start"
      trigger="click"
      onAction={(item) => onChange?.(item.key as string)}
    >
      <a className="px-2 py-1 flex items-center mx-4">
        <span className="text-xs text-[#3D3A50]">{value}</span>
      </a>
    </Container>
  );
};

const Container = styled(Popover.Menu)`
  .adm-popover-menu-item {
    padding: 0;
    &:not(:last-child) {
      border-bottom: 1px solid #f1f3ff;
    }
    .adm-popover-menu-item-text {
      padding: 8px 0;
      border: 0;
      text-align: center;
    }
  }
`;

export default OptionalCurrencies;
