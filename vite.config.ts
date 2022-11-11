import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/procoin': {
        target: 'http://api.piglobalexchanges.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [
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
