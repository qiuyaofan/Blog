// 创建 Vue Router https://next.router.vuejs.org/zh/api/#createrouter
import { createRouter, createWebHistory } from 'vue-router';

import { demos } from './modules';

const router = createRouter({
  history: createWebHistory(),
  routes: [...demos],
});

router.beforeEach(async (to, from) => {
  if (to.matched.length > 0) return;
  const firstRoute = router.options.routes[0];
  return firstRoute;
});

export default router;
