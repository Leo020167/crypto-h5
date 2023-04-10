import { FloatingPanel, Mask } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import symbol_selection_png from '../../assets/floating-panel-bg.png';

interface CoinSymbolDialogProps {
  symbols?: string[];
  open: boolean;
  onClose: () => void;
  defaultValue?: string;
  onSelect?: (value?: string) => void;
}

const anchors = [window.innerHeight * 0.5, window.innerHeight * 0.8];

const CoinSymbolSelectDialog = ({
  symbols = [],
  open,
  onClose,
  defaultValue,
  onSelect,
}: CoinSymbolDialogProps) => {
  const [selected, setSelected] = useState<string | undefined>(defaultValue);

  const [height, setHeight] = useState(window.innerHeight * 0.5 - 28);

  const handleClick = useCallback((v: string) => {
    setSelected(v);
  }, []);

  const intl = useIntl();

  return (
    <Container visible={open} onMaskClick={onClose} destroyOnClose>
      <FloatingPanel
        anchors={anchors}
        handleDraggingOfContent={false}
        onHeightChange={(height, animating) => {
          if (!animating) {
            setHeight(height - 28);
          }
        }}
      >
        <div
          className="symbol-list flex min-h-0 flex-col duration-300 ease-in-out"
          style={{ height }}
        >
          <div className="mb-7 px-5 text-base font-bold">
            {intl.formatMessage({ defaultMessage: '選擇幣種', id: 'jJ0rDY' })}
          </div>
          <div className="flex-1 overflow-y-auto">
            {symbols.map((v) => (
              <a
                key={v}
                className={`symbol-list-item flex h-11 items-center justify-center duration-300 ease-in-out ${
                  v === selected ? 'active' : ''
                }`}
                onClick={() => handleClick(v)}
              >
                {v}
              </a>
            ))}
          </div>
          <div className="p-4">
            <a className="btn-purple" onClick={() => onSelect?.(selected)}>
              {intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' })}
            </a>
          </div>
        </div>
      </FloatingPanel>
    </Container>
  );
};

const Container = styled(Mask)`
  .adm-floating-panel {
    .adm-floating-panel-header .adm-floating-panel-bar {
      --adm-color-light: #4d4bda;
      width: 35px;
      height: 6px;
    }

    .adm-floating-panel-content {
      overflow-y: hidden;
    }
  }

  .symbol-list {
    background-image: url(${symbol_selection_png});
    background-position: top right;
    background-size: 390px 383px;
    background-repeat: no-repeat;

    .symbol-list-item {
      color: #a2a9bc;

      &.active {
        background: linear-gradient(
          89deg,
          rgba(255, 255, 255, 0.302) 0%,
          #eeeeee 49%,
          rgba(255, 255, 255, 0.302) 100%
        );
        color: #3e4660;
      }
    }
  }
`;

export default CoinSymbolSelectDialog;
