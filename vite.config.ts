import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// If router login page require Captcha, then you have to complete the Captcha on actual
// router login page, unable to handle it in js api
const routerIP = 'http://192.168.50.1';
const username = 'admin';
const password = 'routeradmin';

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
  },
  define: {
    loginCredentials: {
      userName: username,
      passWord: password
    }
  }
});
