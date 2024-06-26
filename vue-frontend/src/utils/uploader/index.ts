export interface ParamsUploaderOptions {
  chunkSize?: number;
  syncLimit?: number;
  file: File;
  filename?: string;
  extra?: {
    [x: string]: any;
  };
}

type UploaderOptions = Required<Omit<ParamsUploaderOptions, 'extra'>> &
  Pick<ParamsUploaderOptions, 'extra'>;

export interface Chunk {
  file: Blob;
  index: number;
}

export class Uploader {
  options: UploaderOptions;
  uploadId = '';
  chunkTotal = 0;
  chunkList: Chunk[] = [];
  errorList: Chunk[] = [];
  isRunning = false;
  chunkUploadedTotal = 0;
  total = 0;
  state: 'init' | 'fail' | 'success' | 'cancel' = 'init';
  progress = 0;

  constructor(options: ParamsUploaderOptions) {
    const defaultOptions = {
      chunkSize: 1 * 1024 * 1024,
      syncLimit: 6,
    };

    this.options = {
      ...defaultOptions,
      ...{ filename: options.file.name || '文件' },
      ...options,
    };
  }
  get filename() {
    return this.options.filename || '';
  }
  checkCache() {}
  fetchInitUpload() {
    throw new Error('请添加初始化分片上传请求，请求失败需要抛出异常');
  }
  fetchPartUpload(chunk: Chunk) {
    throw new Error('请添加单个分片上传请求，请求失败需要抛出异常');
  }
  fetchUploadComplete() {
    throw new Error('请添加分片上传完成请求，请求失败需要抛出异常');
  }
  fetchUploadCancel() {
    throw new Error('请添加分片上传取消请求，请求失败需要抛出异常');
  }
  uploadFail(errorList: Chunk[]) {
    throw new Error('请添加分片上传失败处理');
  }
  progressUpdate(progress: number) {
    if (import.meta.env.DEV) {
      console.log('[Debug]', '请添加进度更新处理');
    }
  }
  reset() {
    this.chunkTotal = 0;
    this.chunkUploadedTotal = 0;
    this.total = 0;
    this.chunkList = [];
    this.errorList = [];
    this.isRunning = false;
    this.state = 'init';
  }

  async run() {
    this.reset();
    this.isRunning = true;
    this.splitChunk();
    await this.runFetchInitUpload();
    await this.startUpload();
  }
  async runFetchInitUpload() {
    try {
      await this.fetchInitUpload();
    } catch (err) {
      console.error(err);
      this.handleUploadFail();
    }
  }

  handleUploadFail() {
    this.uploadFail(this.errorList);
    this.isRunning = false;
    this.state = 'fail';
  }
  async retry() {
    if (!this.uploadId || this.state === 'cancel') {
      return this.run();
    }
    if (!this.errorList.length) {
      return this.completeUpload();
    }
    this.chunkList = [...this.errorList];
    this.chunkTotal = this.chunkList.length;
    this.chunkUploadedTotal = this.total - this.chunkTotal;
    this.errorList = [];
    this.isRunning = true;
    this.state = 'init';
    this.updateProcess();
    await this.startUpload();
  }
  async cancel() {
    try {
      if (this.uploadId && this.isRunning) {
        this.isRunning = false;
        this.state = 'cancel';
        await this.fetchUploadCancel();
        this.reset();
        this.state = 'cancel';
      }
    } catch (err) {
      console.error(err);
    }
  }
  splitChunk() {
    const { file, chunkSize } = this.options;
    this.chunkTotal = Math.ceil(file.size / chunkSize);
    this.total = this.chunkTotal;
    let currentChunkSize = 0;
    let index = 0;
    const chunkList = [];
    while (currentChunkSize < file.size) {
      chunkList.push({
        file: file.slice(currentChunkSize, currentChunkSize + chunkSize),
        index,
      });
      currentChunkSize += chunkSize;
      index += 1;
    }
    this.chunkList = chunkList;
  }

  startUpload() {
    const { syncLimit } = this.options;
    let index = 0;
    while (index < syncLimit && this.chunkList.length > 0) {
      this.nextUpload();
      index++;
    }
  }
  updateProcess() {
    this.progress =
      this.chunkTotal === 0
        ? 99
        : Math.floor((this.chunkUploadedTotal / (this.chunkTotal + this.chunkUploadedTotal)) * 100);
  }
  async nextUpload() {
    if (!this.chunkList.length || !this.isRunning) return;
    const chunk = this.chunkList.shift() as Chunk;
    try {
      await this.fetchPartUpload(chunk);
    } catch (err) {
      console.error(err);
      this.errorList.push(chunk);
    }
    this.chunkUploadedTotal++;
    this.chunkTotal--;
    this.updateProcess();
    this.progressUpdate(this.progress);
    if (this.chunkTotal === 0) {
      return this.completeUpload();
    }
    this.nextUpload();
  }
  async completeUpload() {
    if (this.state === 'cancel') return;
    if (this.errorList.length) {
      return this.handleUploadFail();
    }
    try {
      await this.fetchUploadComplete();
      this.progress = 100;
      this.state = 'success';
      this.isRunning = false;
    } catch (err) {
      console.error(err);
      this.handleUploadFail();
    }
  }
}
