<script lang="ts" setup>
import { CloseOutlined, EditOutlined } from '@ant-design/icons-vue';
import { message, type UploadFile } from 'ant-design-vue';
import { debounce } from 'lodash-es';
import { computed, reactive, ref } from 'vue';

import { useModalVisible } from '@/hooks/modal';

import UploadingModal from './uploading-modal.vue';

const VIEDO_ACCEPT = ['mp4', 'flv', 'avi', 'wmv', 'mpeg'];
const VIEDO_ACCEPT_SUBFIX = VIEDO_ACCEPT.map((x) => `.${x}`);
const emit = defineEmits<{
  closeModal: [];
  success: [];
}>();
// const FILE_LIMIT = 500;
const FILE_LIMIT_G = 3;
const FILE_NUMBER_LIMIT = 5;
const fileList = ref<UploadFile[]>([]);
const okButtonDisabled = computed(() => !fileList.value?.length);
const fileEditValue = ref<Pick<UploadFile, 'uid' | 'name'>>();
const isEdit = ref(false);
const inputRef = ref();
const visible = ref(true);

const beforeUpload = (file: File) => {
  return false;
};

const getFileName = (name: string) => {
  const names = name.split('.');
  const subffix = names.pop();
  return {
    name: names.join('.'),
    subffix,
  };
};

const checkFileList = (_fileList?: Pick<UploadFile, 'size' | 'name' | 'originFileObj'>[]) => {
  if (!_fileList) return;
  let tip = '';
  _fileList?.some((file) => {
    const isVideo = VIEDO_ACCEPT_SUBFIX.includes(`.${getFileName(file.name).subffix}`);
    // const isVideo = true;
    if (!isVideo) {
      tip = `仅支持${VIEDO_ACCEPT.join('、')}格式`;
      return true;
    }
    if ((file?.size || 0) > FILE_LIMIT_G * 1024 * 1024 * 1024) {
      tip = `文件大小不能超过${FILE_LIMIT_G}G`;
      return true;
    }
    return false;
  });
  return tip;
};
const handleChange = (info: any) => {
  if (!info.file) return;
  // 包含之前的文件
  const _fileList = [...info.fileList];
  if (_fileList?.length > FILE_NUMBER_LIMIT) {
    message.error(`单次最多只能上传${FILE_NUMBER_LIMIT}个视频`);
    _fileList.splice(5);
  }
  const errorTip = checkFileList(_fileList);
  if (errorTip) {
    message.error(errorTip);
  }

  fileList.value = _fileList.filter((file) =>
    VIEDO_ACCEPT_SUBFIX.includes(`.${getFileName(file.name).subffix}`),
  );
};
const handleChangeDebounce = debounce(handleChange, 250);

const isFileListRepeat = () => {
  const names = fileList.value.map((item) => getFileName(item.name).name).sort();
  const result: string[] = [];
  names.forEach((name, i) => {
    if (i > 0 && name === names[i - 1] && name !== names[i - 2]) {
      result.push(name);
    }
  });
  return result;
};

const handleUpload = async () => {
  const existNames = isFileListRepeat();
  if (existNames.length) {
    return message.error(`文件名${existNames.join('、')}重复了，请修改后重新上传`);
  }

  visible.value = false;
  showUploadingModal();
};

const handleDrop = (e: DragEvent) => {
  if (!e.dataTransfer?.files) return;
  const errorTip = checkFileList(Array.from(e.dataTransfer?.files));
  if (errorTip) {
    return message.error(errorTip);
  }
};

const handleDeleteFile = (index: number) => {
  fileList.value?.splice(index, 1);
};

const handleEditFile = (index: number) => {
  const { name, uid } = { ...fileList.value[index] };
  fileEditValue.value = { name, uid };
  if (fileEditValue.value) {
    isEdit.value = true;
    fileEditValue.value.name = getFileName(fileEditValue.value.name).name;

    setTimeout(() => {
      inputRef.value[0].focus();
    }, 400);
  }
};

const handleEditDone = (index: number) => {
  isEdit.value = false;
  const name = fileEditValue.value?.name;
  const file = fileList.value[index];
  fileList.value[index] = {
    ...file,
    name: `${name}.${getFileName(file.name).subffix}`,
  };
};

const {
  modalVisble: uploadingModalVisble,
  showModal: showUploadingModal,
  hideModal: hideUploadingModal,
} = useModalVisible();

const handleUploadSuccess = () => {
  console.info('success');
  hideUploadingModal();
  emit('success');
};

const closeUploading = () => {
  visible.value = true;
  hideUploadingModal();
};
</script>
<template>
  <div>
    <a-modal
      v-model:visible="visible"
      title="添加视频"
      :okButtonProps="{ disabled: okButtonDisabled }"
      :maskClosable="false"
      @ok="handleUpload"
      @cancel="emit('closeModal')"
    >
      <div class="upload-main">
        <a-upload-dragger
          name="file"
          :file-list="fileList"
          :multiple="true"
          :before-upload="beforeUpload"
          @change="handleChangeDebounce"
          @drop="handleDrop"
          :showUploadList="false"
          :accept="VIEDO_ACCEPT_SUBFIX.join(',')"
        >
          <p class="ant-upload-drag-icon">
            <img src="@/assets/images/upload-cloud.png" alt="" />
          </p>
          <p class="ant-upload-text">
            将文件拖拽到这里上传，或<span class="primary">点击上传</span>
          </p>
          <p class="ant-upload-hint">
            支持{{ VIEDO_ACCEPT.join('/') }}等格式；单个文件最大不超过<br />{{
              FILE_LIMIT_G
            }}G；单次最多上传{{ FILE_NUMBER_LIMIT }}个视频
          </p>
        </a-upload-dragger>
        <div class="input-main">
          <div class="ant-upload-list ant-upload-list-text">
            <div class="ant-upload-list-item" v-for="(file, index) in fileList" :key="file.uid">
              <div class="ant-upload-span">
                <div class="ant-upload-list-item-name">
                  <span v-if="isEdit && fileEditValue && fileEditValue.uid === file.uid">
                    <a-input
                      ref="inputRef"
                      class="edit-name"
                      :key="fileEditValue.uid"
                      v-model:value="fileEditValue.name"
                      placeholder="请输入文件名称"
                      @pressEnter="handleEditDone(index)"
                      @blur="handleEditDone(index)"
                    />
                  </span>
                  <span v-else>{{ file.name }}</span>
                </div>
                <div
                  class="ant-upload-list-item-card-actions"
                  v-if="!(isEdit && fileEditValue && fileEditValue.uid === file.uid)"
                >
                  <edit-outlined class="edit-icon" @click="handleEditFile(index)" />
                  <close-outlined class="close-icon" @click="handleDeleteFile(index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <UploadingModal
      @close-modal="closeUploading"
      @success="handleUploadSuccess"
      :fileList="fileList"
      v-if="uploadingModalVisble"
    ></UploadingModal>
  </div>
</template>

<style lang="scss" scoped>
.upload-main {
  position: relative;
  :deep() {
    .ant-upload.ant-upload-drag {
      background: #f8fafb;
      .ant-upload {
        padding: 24px 0;
      }
      .ant-upload-drag-icon {
        margin-bottom: 0;
      }
    }
    .ant-upload-text {
      font-weight: bold;
      font-size: 14px;
      span {
        font-weight: normal;
      }
    }
  }
  .input-main {
    .ant-upload-list-item-card-actions {
      display: none;
      width: 40px;
      height: 14px;
      background-color: #fff;
    }
    :deep(.ant-upload-list-item) {
      &:hover .ant-upload-list-item-card-actions {
        display: block;
      }
    }
    .close-icon,
    .edit-icon {
      font-size: 14px;
      top: 4px;
      transition: none;
      opacity: 1;
    }
    .edit-icon {
      position: absolute;
      right: 30px;
      cursor: pointer;
      opacity: 0;
    }
    :deep(.ant-upload-list-item) {
      margin-top: 24px;
      &:hover {
        .edit-icon {
          opacity: 1;
        }
      }
    }
    .edit-name {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
