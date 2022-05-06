import { createApp } from 'vue';
import App from './App.vue';
import globalInstall from './plugins/global';
import router from './router';
import store from './store';

const app = createApp(App).use(store).use(router);
globalInstall(app);
app.mount('#app');
