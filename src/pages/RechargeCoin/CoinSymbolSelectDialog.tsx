import { FloatingPanel, Mask } from 'antd-mobile';
import { useCallback, useState } from 'react';
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
          className="flex flex-col min-h-0 ease-in-out duration-300 symbol-list"
          style={{ height }}
        >
          <div className="mb-7 text-base px-5 font-bold">選擇幣種</div>
          <div className="flex-1 overflow-y-auto">
            {symbols.map((v) => (
              <a
                key={v}
                className={`ease-in-out duration-300 flex items-center justify-center h-11 symbol-list-item ${
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
              確定
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
      height: 6px;
      width: 35px;
    }

    .adm-floating-panel-content {
      overflow-y: hidden;
    }
  }

  .symbol-list {
    background-image: url(${symbol_selection_png});
    background-repeat: no-repeat;
    background-position: top right;
    background-size: 390px 383px;

    .symbol-list-item {
      color: #a2a9bc;

      &.active {
        color: #3e4660;
        background: linear-gradient(
          89deg,
          rgba(255, 255, 255, 0.302) 0%,
          #eeeeee 49%,
          rgba(255, 255, 255, 0.302) 100%
        );
      }
    }
  }
`;

export default CoinSymbolSelectDialog;
