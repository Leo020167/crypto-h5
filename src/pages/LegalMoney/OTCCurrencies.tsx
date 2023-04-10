import { Popover } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useMemo } from 'react';
import styled from 'styled-components';
import { useOtcConfig } from '../../api/endpoints/transformer';

interface OTCCurrenciesProps {
  value?: string;
  onChange?: (value: string) => void;
}
const OTCCurrencies = ({ value, onChange }: OTCCurrenciesProps) => {
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
      <a className="ml-4 flex items-center rounded bg-[#f1f3ff] px-2 py-1">
        <span className="text-xs text-[#3D3A50]">{value}</span>
        <DownFill className=" ml-4 mr-1 h-3 w-3 text-[#746f6f]" />
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
      border: 0;
      padding: 8px 0;
      text-align: center;
    }
  }
`;

export default OTCCurrencies;
