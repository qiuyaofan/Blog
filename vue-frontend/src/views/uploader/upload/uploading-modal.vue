<script lang="ts" setup>
import { type UploadProps } from 'ant-design-vue';
import { ref } from 'vue';

import { useUpload } from './hook-upload';
import type { UploaderDemo } from './uploader-demo';
import UploadFile from './uploading-file.vue';

const emit = defineEmits<{
  closeModal: [];
  success: [];
}>();
export interface Props {
  fileList: UploadProps['fileList'];
  // uploadProgress: number;
}
const props = defineProps<Props>();
const { retryUploadSingle, uploaders, startBatchUpload, deleteUpload, cancelUploadAll } = useUpload(
  { emit },
);
const fileListActive = ref(props.fileList);

const handleFileUploadCancel = () => {
  cancelUploadAll();
  emit('closeModal');
};

const handleDelete = (index: number) => {
  deleteUpload(index);
};
const handleUploadRetry = (uploader: UploaderDemo) => {
  retryUploadSingle(uploader);
};

const init = () => {
  if (!props.fileList) return;
  const files = props.fileList.map((item) => item.originFileObj) as File[];
  // 开始批量上传
  startBatchUpload(
    files,
    props.fileList.map((x) => x.name),
  );
};

const getUploadStatus = (state: string) => {
  switch (state) {
    case 'init':
      return 'waiting';
    case 'fail':
    case 'cancel':
      return 'failed';
    case 'success':
      return 'success';
  }
  return 'waiting';
};

init();
</script>
<template>
  <div>
    <a-modal
      :visible="true"
      title="上传视频"
      :maskClosable="false"
      @cancel="handleFileUploadCancel"
    >
      <UploadFile
        ref="uploadFileRef"
        v-for="(file, index) in fileListActive"
        :key="file.uid"
        v-show="uploaders[index].state !== 'cancel'"
        :file="file"
        :uploadProgress="uploaders[index].progress"
        :uploadStatus="getUploadStatus(uploaders[index].state)"
        @onDelete="handleDelete(index)"
        @uploadRetry="handleUploadRetry(uploaders[index])"
      ></UploadFile>
      <template #footer>
        <a-button key="back" @click="handleFileUploadCancel">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>
