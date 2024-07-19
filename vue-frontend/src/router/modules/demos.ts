import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/home-index.vue'),
  },
  {
    path: '/demo/password-input',
    name: 'PasswordInput',
    component: () => import('@/views/demo/password-input.vue'),
  },
  {
    path: '/demo/uploader',
    name: 'UploaderDemo',
    component: () => import('@/views/uploader/upload-demo.vue'),
  },
];

export default routes;
