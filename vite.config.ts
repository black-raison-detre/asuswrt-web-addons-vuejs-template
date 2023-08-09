import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

const routerIP = 'http://192.168.50.1';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      fullInstall: false
    })
    ],
  server: {
    proxy: {
      '/appGet.cgi': {
        target: routerIP,
        changeOrigin: false
      },
      '/applyapp.cgi': {
        target: routerIP,
        changeOrigin: false
      },
      '/login.cgi': {
        target: routerIP,
        changeOrigin: false
      }
    }
  }
});
