import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vitePluginImp from 'vite-plugin-imp';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd());
  return {
    server: {
      proxy: {
        // http://api.piglobalexchanges.com/procoin/swagger/index.html#/
        // http://api.worldcoinservice.com/procoin/swagger/index.html#/
        '/procoin-market': {
          target: 'http://market.encryptedex.com',
          changeOrigin: true,
        },
        '/procoin-file': {
          target: 'http://upload.encryptedex.com',
          changeOrigin: true,
        },
        '/procoin': {
          target: 'http://api.encryptedex.com',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
      }),
      vitePluginImp({
        libList: [
          {
            libName: 'antd-mobile',
            libDirectory: 'es/components',
            style: () => false,
          },
        ],
      }),
      react({
        babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
      }),
      legacy({
        targets: {
          chrome: '49',
          ios: '10',
        },
      }),
      svgr(),
    ],
  };
});
