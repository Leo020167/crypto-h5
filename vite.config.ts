import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      outDir: `dist/Cryptographe-${mode === 'allow-download' ? '有下載' : '無下載'}`,
    },
    server: {
      proxy: {
        // http://api.piglobalexchanges.com/procoin/swagger/index.html#/
        // http://api.worldcoinservice.com/procoin/swagger/index.html#/
        '/procoin-market': {
          target: 'http://market.cryptographexx.com',
          changeOrigin: true,
        },
        '/procoin-file': {
          target: 'http://upload.cryptographexx.com',
          changeOrigin: true,
        },
        // http://api.cryptographexx.com
        '/procoin': {
          target: 'http://api.cryptographexx.com',
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
      react(),
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
