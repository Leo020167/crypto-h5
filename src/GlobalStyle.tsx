import * as styled from 'styled-components';
const GlobalStyle = styled.createGlobalStyle`
  @font-face {
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
    font-family: AlibabaPuHuiTi;
  }

  @font-face {
    font-weight: bold;
    src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-65-Medium/AlibabaPuHuiTi-2-65-Medium.eot)
        format('embedded-opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-65-Medium/AlibabaPuHuiTi-2-65-Medium.otf)
        format('opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-65-Medium/AlibabaPuHuiTi-2-65-Medium.ttf)
        format('TrueType'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-65-Medium/AlibabaPuHuiTi-2-65-Medium.woff)
        format('woff'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-65-Medium/AlibabaPuHuiTi-2-65-Medium.woff2)
        format('woff2');
    font-family: AlibabaPuHuiTi;
  }

  :root {
    --adm-color-primary: #6175ae;
    --adm-font-family: AlibabaPuHuiTi;
  }

  html,
  body {
    margin: 0;
    font-family: AlibabaPuHuiTi, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  .adm-image-uploader-upload-button-icon {
    svg {
      display: initial;
    }
  }

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    background-color: var(--background-color);
  }

  .btn-purple,
  .adm-button.btn-purple {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 10px 0px rgba(252, 192, 84, 0.3);
    border-radius: 6px;
    background: linear-gradient(360deg, #4d4bda 0%, #7270f8 100%);
    height: 44px;
    color: #fff;
  }

  .adm-nav-bar {
    border-bottom: 1px solid #f6f6f6;
  }

  .adm-list-item-content-main {
    color: #2a3654;
    font-size: 0.875rem;
  }

  .adm-list-default .adm-list-body {
    border: 0;
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
        border-top: 0;
        border-bottom: var(--border-inner);
        padding-right: 0;
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
    font-size: 14px;
  }

  .adm-error-block-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .adm-selector-item {
    border-radius: 4px;
    background-color: #f2f2f2;
    color: #1d3155;
    font-size: 12px;

    &.adm-selector-item-active {
      background-color: #6277b0;
      color: #fff;
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
          color: #262626;
          .adm-tab-bar-item-icon {
            color: #6175ae;
          }
        }
      }
    }
  }

  .adm-input-element {
    font-size: 14px;
  }

  .adm-button-default.adm-button-fill-none {
    --background-color: #f7f7f7;
  }

  .phone-bind-alert {
    .adm-button.adm-button-large,
    .adm-modal-button:not(.adm-modal-button-primary) {
      padding-top: 4px;
      padding-bottom: 4px;
    }

    .adm-modal-button:not(.adm-modal-button-primary) {
      margin-left: 8px;
    }
  }
`;
export default GlobalStyle;
