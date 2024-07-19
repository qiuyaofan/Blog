import { postUploadCancel, postUploadInit, postUploadMerge, postUploadPart } from '@/api';
import { type Chunk, Uploader } from '@/utils/uploader';
export const COMPLETE_KEY_NAME = 'objectKey';
export class UploaderDemo extends Uploader {
  async fetchInitUpload() {
    const [err, res] = await postUploadInit();
    if (err) {
      throw new Error('上传失败');
    }
    this.uploadId = res.data.uploadId;
  }
  async fetchPartUpload(chunk: Chunk) {
    // throw new Error('部分上传失败');
    const [err, res] = await postUploadPart({
      uploadId: this.uploadId,
      file: chunk.file,
      currentIndex: chunk.index,
      totalChunks: this.total,
    });
    if (err) {
      throw new Error('部分上传失败');
    }
  }
  async fetchUploadComplete() {
    const [err, res] = await postUploadMerge({
      uploadId: this.uploadId,
      totalChunks: this.total,
      filename: this.filename,
    });
    if (err) {
      throw new Error('上传失败');
    }
    // throw new Error('请添加分片上传完成请求，请求失败需要抛出异常');
    if (this.options.extra) {
      this.options.extra.objectKey = res.data[COMPLETE_KEY_NAME];
      this.options.extra.handleFinish();
    }
  }
  async fetchUploadCancel() {
    if (this.uploadId) {
      const [err, res] = await postUploadCancel({
        uploadId: this.uploadId,
      });
      if (err) {
        throw new Error('取消上传失败');
      }
    }

    // throw new Error('请添加分片上传取消请求，请求失败需要抛出异常');
    this.options.extra?.handleFinish();
  }
  uploadFail(errorList: Chunk[]) {
    // throw new Error('请添加部分分片上传失败处理');
    this.options.extra?.handleFinish();
  }
  progressUpdate(progress: number) {
    this.options.extra?.handleProgress(progress);
  }
}
