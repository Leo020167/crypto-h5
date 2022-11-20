import * as styled from 'styled-components';
const GlobalStyle = styled.createGlobalStyle`
  @font-face {
    font-family: AlibabaPuHuiTi;
    font-weight: 400;
    src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.eot)
        format('embedded-opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.otf)
        format('opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.ttf)
        format('TrueType'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.woff)
        format('woff'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.woff2)
        format('woff2');
  }

  @font-face {
    font-family: AlibabaPuHuiTi;
    font-weight: bold;
    src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.eot)
        format('embedded-opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.otf)
        format('opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.ttf)
        format('TrueType'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.woff)
        format('woff'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.woff2)
        format('woff2');
  }

  :root {
    --adm-color-primary: #6277b0;
  }

  html,
  body {
    margin: 0;
    font-family: AlibabaPuHuiTi, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    background-color: var(--background-color);
  }

  .adm-nav-bar {
    border-bottom: 1px solid #f6f6f6;
  }

  .adm-list-item-content-main {
    font-size: 0.875rem;
    color: #2a3654;
  }

  .adm-form {
    .adm-input-element {
      padding: 0 1rem;
      font-size: 0.875rem;
    }

    .adm-list-body {
      border: 0;

      .adm-list-item {
        padding-left: 0;
      }

      .adm-list-item-content {
        padding-right: 0;
        border-top: 0;
        border-bottom: var(--border-inner);
      }
    }

    .adm-form-footer {
      padding: 20px 0;

      .adm-button {
        font-size: 0.875rem;
      }
    }
  }

  .adm-dialog-footer .adm-dialog-action-row > .adm-dialog-button {
    font-size: 14px;
  }

  .adm-modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .adm-space-item {
      margin: 0;
      .adm-modal-button {
        font-size: 0.875rem;
      }
    }
  }

  .adm-text-area {
    --font-size: 0.875rem;
  }

  .adm-button {
    font-size: 14px !important;
  }

  .adm-selector-item {
    font-size: 12px;
    color: #1d3155;
    background-color: #f2f2f2;
    border-radius: 4px;

    &.adm-selector-item-active {
      color: #fff;
      background-color: #6277b0;
    }
  }

  .adm-popover .adm-popover-arrow {
    display: none;
  }

  .adm-tab-bar {
    &.layout {
      border-top: 1px solid #f5f5f5;
      .adm-tab-bar-item {
        color: #bababa;
        .adm-tab-bar-item-icon {
          color: #b2bdcb;
        }

        &.adm-tab-bar-item-active {
          .adm-tab-bar-item-icon {
            color: #6175ae;
          }
          color: #262626;
        }
      }
    }
  }

  .adm-input-element {
    font-size: 14px;
  }
`;
export default GlobalStyle;
