<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { useModalVisible } from '@/hooks/modal';

import UploadModal from './upload/upload-modal.vue';
const {
  modalVisble: uploadModalVisble,
  showModal: showUploadModal,
  hideModal: hideUploadModal,
} = useModalVisible();

const handleSuccess = () => {
  hideUploadModal();
  message.success('上传成功');
};
</script>
<template>
  <div class="global-layout-content">
    <a-button type="primary" @click="showUploadModal">上传文件</a-button>
    <UploadModal
      @success="handleSuccess"
      @close-modal="hideUploadModal"
      v-if="uploadModalVisble"
    ></UploadModal>
  </div>
</template>
<style lang="scss" scoped></style>
