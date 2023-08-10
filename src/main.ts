import { createApp } from 'vue';
import { login } from '@/apiASUS';
import i18n from '@/i18n';
import App from '@/App.vue';

// Do login in development Mode
if (import.meta.env.DEV) {
	// @ts-ignore
	console.log(await login(loginCredentials.userName, loginCredentials.passWord) ? 'Login Success!!' : 'Login Fail!!');
}

const app = createApp(App);
app.use(i18n);
app.mount('#app');
