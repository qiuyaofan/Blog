import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/demo/password-input',
    name: 'PasswordInput',
    component: () => import('@/views/demo/password-input.vue'),
  },
];

export default routes;
