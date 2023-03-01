import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist/LeaderCoin-H5',
  },
  server: {
    proxy: {
      // http://api.piglobalexchanges.com/procoin/swagger/index.html#/
      // http://api.worldcoinservice.com/procoin/swagger/index.html#/
      '/procoin-market': {
        target: 'http://market.qokwjxf.cn',
        changeOrigin: true,
      },
      '/procoin-file': {
        target: 'http://upload.qokwjxf.cn',
        changeOrigin: true,
      },
      '/procoin': {
        target: 'http://api.qokwjxf.cn',
        changeOrigin: true,
      },
    },
  },
  plugins: [
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
});
