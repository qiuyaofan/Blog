import { ref, watch } from 'vue';

import { type ParamsUploaderOptions } from '@/utils/uploader';

import { UploaderDemo } from './uploader-demo';

export const useUpload = (options: { emit?: any }) => {
  const countFinish = ref(0);
  const isBatchUpload = ref(false);
  const uploaders = ref<UploaderDemo[]>([]);

  const deleteUpload = (index: number) => {
    const uploader = uploaders.value[index];
    uploader.cancel();
  };
  // 取消上传单个
  const cancelUploadAll = () => {
    uploaders.value.forEach((uploader: UploaderDemo) => {
      uploader.cancel();
    });
  };
  // 重试全部
  const retryUploadAll = () => {
    isBatchUpload.value = true;
    countFinish.value = 0;
  };
  // 重试单个文件
  const retryUploadSingle = (uploader: UploaderDemo) => {
    countFinish.value--;
    uploader.retry();
  };

  // 开始上传
  const startUpload = (options: ParamsUploaderOptions) => {
    const uploader = new UploaderDemo({
      ...options,
      syncLimit: 3,
      chunkSize: 4 * 1024 * 1024,
      extra: {
        handleFinish: () => {
          countFinish.value++;
        },
        handleCancel: () => {
          if (uploader.isRunning) {
            countFinish.value++;
          }
        },
        handleProgress: (progress: number) => {
          // console.info(progress);
        },
        objectKey: '',
      },
    });
    return uploader;
  };
  // 开始批量上传
  const startBatchUpload = (list: File[], names?: string[]) => {
    isBatchUpload.value = true;
    countFinish.value = 0;
    uploaders.value = [];
    list.forEach((file, index) => {
      const filename = (names && names[index]) || file.name;
      const _uploader = startUpload({
        file,
        filename,
      });
      uploaders.value.push(_uploader);
    });
    uploaders.value[0].run();
  };
  // 全部上传完成，调用添加到视频列表
  const handleAllUploadFinish = async () => {
    const params = uploaders.value.map((uploader: UploaderDemo) => ({
      fileName: uploader.filename,
      objectKey: uploader.options.extra?.objectKey,
    }));
    const isDone = params.filter((x) => !!x.objectKey).length === uploaders.value.length;
    if (!isDone) {
      return;
    }
    if (options.emit) {
      options.emit('success');
    }
    // message.error('添加视频');
  };

  // 监听上传完成数量，判断分片是否都上传完了（包括成功、失败）
  watch(
    () => countFinish.value,
    (value) => {
      const unFinish = value < uploaders.value.length;
      // 批量上传才需要继续上传下一个
      if (unFinish && isBatchUpload.value) {
        if (['success', 'cancel'].includes(uploaders.value[value].state)) {
          return countFinish.value++;
        }
        return uploaders.value[value].run();
      }
      // 判断是否上传完成
      if (unFinish) return;
      // 全部上传完成则调用添加视频接口
      handleAllUploadFinish();
      isBatchUpload.value = false;
    },
  );

  return {
    startUpload,
    countFinish,
    startBatchUpload,
    retryUploadAll,
    retryUploadSingle,
    deleteUpload,
    uploaders,
    cancelUploadAll,
  };
};
