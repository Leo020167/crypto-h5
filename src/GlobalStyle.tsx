import * as styled from 'styled-components';
const GlobalStyle = styled.createGlobalStyle`
  :root {
    --adm-color-primary: #6175ae;
    --adm-font-family: AlibabaPuHuiTi;
  }

  html,
  body {
    margin: 0;
    font-family:
      AlibabaPuHuiTi,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      'Noto Sans',
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji';
  }

  .adm-image-uploader-upload-button-icon {
    svg {
      display: initial;
    }
  }

  .adm-tab-bar-item {
    padding: 8px;
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
    font-size: var(--adm-font-size-8);
    padding: 10px 12px;
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

  body {
    position: relative;
    background-color: #eef3f9;
  }

  .pledge-card {
    height: 70px;
    background: linear-gradient(
      180deg,
      rgba(237, 242, 249, 0.69) 0%,
      rgba(210, 220, 249, 0.52) 100%
    );
    border-radius: 4px;
    border: 1px solid #bfc3fc;
  }

  .pledge-history {
    .adm-tabs {
      --title-font-size: 16px;
      --active-line-color: #4d4bda;
      --active-title-color: #4d4bda;

      .adm-tabs-header {
        border: 0;
      }

      .adm-tabs-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        background-color: #f4f6f4;
        padding: 16px;
        overflow-y: auto;
      }

      .adm-error-block-description-title {
        color: #666;
        font-size: 14px;
      }
    }
  }

  html.dark {
    --adm-color-box: #2a2e38;
    --adm-color-text: #fff;
    --adm-color-fill-content: #2a2e38;
    --adm-color-background: #161720;

    .adm-tabs {
      --active-title-color: #fff;
      --active-line-color: #0bbb79;
      --title-font-size: 16px;
      color: #aaaaaa;
    }

    .home-tabs {
      --adm-color-background: #2a2e38;
    }

    .adm-tab-bar {
      border-top-color: #333;
      background-color: #333;
      .adm-tab-bar-item-title {
        color: #bbb;
      }
      .adm-tab-bar-item-active {
        .adm-tab-bar-item-title {
          color: #fff;
        }
      }
    }

    .adm-nav-bar-back-arrow {
      color: #fff;
    }

    .adm-nav-bar {
      border-color: #2a2e38;
    }

    .adm-form .adm-list,
    .adm-list {
      --border-inner: 1px solid #3d424e;
      .adm-list-item-content-main {
        color: #fff;
      }
    }

    .eye {
      color: #00bab8;
    }

    .adm-input {
      --placeholder-color: #696d79;
    }

    .my-list {
      .adm-list {
        --border-inner: 1px solid #161720;
        .adm-list-item-content-main {
          color: #fff;
        }

        .adm-list-item {
          background-color: #2a2e38;
        }
      }
    }

    .market-list {
      .adm-list-item {
        background-color: #3d424e;
      }
      .adm-list-item:nth-child(odd) {
        background-color: #2a2e38;
      }
    }

    .adm-floating-panel {
      background-image: none;
      background-color: #333;
      .adm-floating-panel-header {
        .adm-floating-panel-bar {
          --adm-color-light: #0bbb79;
        }
      }
    }

    .pledge-card {
      border-color: #3d424e;
      background: #3d424e;
    }

    .pledge-history {
      .adm-tabs {
        --title-font-size: 16px;
        --active-line-color: #0bbb79;
        --active-title-color: #fff;

        .adm-tabs-header {
          border: 0;
        }

        .adm-tabs-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          background-color: #161720;
          padding: 16px;
          overflow-y: auto;
        }

        .adm-error-block-description-title {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
`;
export default GlobalStyle;
