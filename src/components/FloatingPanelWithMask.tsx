import { Button, FloatingPanel, Mask } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import floating_panel_bg_png from '../assets/floating-panel-bg.png';

interface FloatingPanelWithMaskProps {
  loading?: boolean;
  open?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}

const anchors = [window.innerHeight * 0.5, window.innerHeight * 0.8];

const FloatingPanelWithMask = ({
  loading = false,
  open = false,
  children,
  onClose,
  onConfirm,
}: FloatingPanelWithMaskProps) => {
  const [height, setHeight] = useState(window.innerHeight * 0.5 - 28);

  const handleConfirm = useCallback(() => onConfirm?.(), [onConfirm]);

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
          className="floating-panel-content flex min-h-0 flex-col duration-300 ease-in-out"
          style={{ height }}
        >
          <div className="flex-1 overflow-y-auto">{children}</div>
          <div className="p-4 pb-8">
            <Button block className="btn-purple" onClick={handleConfirm} loading={loading}>
              {intl.formatMessage({ defaultMessage: '確定', id: 'ofc1Jv' })}
            </Button>
          </div>
        </div>
      </FloatingPanel>
    </Container>
  );
};

const Container = styled(Mask)`
  .adm-floating-panel {
    background-image: url(${floating_panel_bg_png});
    background-position: right top;
    background-size: 100% 383px;
    background-repeat: no-repeat;
    background-color: #fff;

    .adm-floating-panel-header {
      background-color: transparent;
      .adm-floating-panel-bar {
        --adm-color-light: #4d4bda;
        width: 35px;
        height: 6px;
      }
    }

    .adm-floating-panel-content {
      background: transparent;
      overflow-y: hidden;
    }
  }
`;

export default FloatingPanelWithMask;
