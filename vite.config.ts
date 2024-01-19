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
    outDir: 'dist/ACGT-H5',
  },
  server: {
    proxy: {
      '/procoin-market': {
        target: 'http://market.jafhm.top',
        changeOrigin: true,
      },
      '/procoin-file': {
        target: 'http://upload.jafhm.top',
        changeOrigin: true,
      },
      '/procoin': {
        target: 'http://api.jafhm.top',
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
