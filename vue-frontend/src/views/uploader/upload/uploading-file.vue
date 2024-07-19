<script lang="ts" setup>
import { DeleteOutlined, ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { type UploadFile } from 'ant-design-vue';
const emit = defineEmits<{
  uploadRetry: [];
  onDelete: [];
}>();
export interface Props {
  file: UploadFile;
  uploadProgress: number;
  uploadStatus: keyof typeof statusMap;
}
const props = defineProps<Props>();
const statusMap = {
  waiting: 'active',
  failed: 'exception',
  success: 'success',
};
</script>
<template>
  <a-row type="flex" align="middle" justify="space-between" class="upload-file">
    <a-row class="left" type="flex" align="middle">
      <span class="file-name ellipsis">{{ file.name }}</span>
      <delete-outlined class="icon" @click="emit('onDelete')" />
    </a-row>
    <div class="progress">
      <a-progress :percent="uploadProgress" :status="statusMap[uploadStatus]" />
      <span class="error-tip" v-if="uploadStatus === 'failed'">
        <a-space>
          <span class="global-color-danger">
            <exclamation-circle-outlined class="progress-icon" />
            上传失败，无法继续上传
          </span>
          <span class="global-color-primary retry" @click="emit('uploadRetry')">
            <redo-outlined />
            刷新重试
          </span>
        </a-space>
      </span>
    </div>
  </a-row>
</template>

<style lang="scss" scoped>
.progress-icon {
  font-size: 16px;
}
.left {
  width: 50%;
  .file-name {
    margin-right: 18px;
    max-width: 195px;
    font-size: 16px;
    // @include ellipsis;
  }
}
.progress {
  width: 50%;
}
.error-tip {
  font-size: 12px;
}
.retry {
  cursor: pointer;
}
</style>
