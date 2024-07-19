import './theme/antdv.less';
import 'dayjs/locale/zh-cn';

import dayjs from 'dayjs';

dayjs.locale('zh-cn');

import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';

import { name, version } from '../package.json';
// eslint-disable-next-line no-console
console.log(`[${name}] runnning on version ${version} ...`);
const initialize = () => {
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
};

initialize();
