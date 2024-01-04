import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      outDir: `dist/StellarVerse-dark-${mode === 'allow-download' ? '有下載' : '無下載'}`,
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        // http://api.piglobalexchanges.com/procoin/swagger/index.html#/
        // http://api.worldcoinservice.com/procoin/swagger/index.html#/
        '/procoin-market': {
          target: 'http://market.stellarverseex.com',
          changeOrigin: true,
        },
        '/procoin-file': {
          target: 'http://upload.stellarverseex.com',
          changeOrigin: true,
        },
        //  http://api.cryptographexx.com/procoin/meiqia
        '/procoin': {
          target: 'https://api.stellarverseex.com',
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
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            extension: 'jsx',
          }),
        ],
      }),
      Icons({
        compiler: 'jsx',
        jsx: 'react',
      }),
    ],
  };
});
