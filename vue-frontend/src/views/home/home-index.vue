<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
interface DataItem {
  title: string;
  description: string;
  path: string;
}
const data: DataItem[] = [
  {
    title: '自定义密码框',
    description: '用于实现不想要记住密码框和自动填充的场景',
    path: '/demo/password-input',
  },
  {
    title: '大文件分片上传',
    description: '支持多个进度、上传流程自定义修改',
    path: '/demo/uploader',
  },
  {
    title: 'pdf截图功能',
    description: '可用于标记等场景',
    path: '/demo/pdf-cropper',
  },
];

const toPath = (path: string) => {
  router.push(path);
};
</script>
<template>
  <div class="global-layout-content">
    <a-list bordered :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a @click="toPath(item.path)">查看</a>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <div>{{ item.title }}</div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
      <template #header>
        <div class="title">组件列表</div>
      </template>
    </a-list>
  </div>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: 600;
}
</style>
