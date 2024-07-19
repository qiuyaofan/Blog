// 优势部分:减少了内存占用，可实现断点续传并发处理，利用带宽，提高效率
// 不足之处:增加复杂性，增加额外计算存储
// 应用场景:云存储大文件上传、多媒体平台音视频上传，需断点续传应用
// 注意事项:合理分块大小，顺序的完整性，异常情况的合理处理
// 处理文件上传的路由

var path = require("path");
const multer = require("multer");

const fs = require("fs");
const crypto = require("crypto");
// const multipart = require("connect-multiparty");
// const multipartMiddleware = multipart();
const UPLOAD_PATH = "../storage/upload/";
const upload = multer({ dest: "tmp/uploads/" });
const Store = require("../utils/store");

const store = new Store();

const initUploadApi = (router) => {
  router.post("/api/upload/init", (req, res) => {
    const uploadId = crypto.randomUUID({ disableEntropyCache: true });
    fs.mkdirSync(path.join(__dirname, UPLOAD_PATH, uploadId));
    return res.json({ data: { data: { uploadId } } });
  });

  router.post("/api/upload/part", upload.single("file"), (req, res) => {
    // 获取文件名，总块数和当前块序号
    const { totalChunks, currentIndex, uploadId } = req.body;
    // 获取上传的文件对象
    const file = req.file;

    // 生成当前块的存储路径
    const chunkPath = path.join(
      __dirname,
      UPLOAD_PATH,
      uploadId,
      `chunk-${currentIndex}`
    );

    if (!fs.existsSync(path.join(__dirname, UPLOAD_PATH, uploadId))) {
      res.status(500).json({ msg: "文件不存在" }); // 响应合并成功的状态
      return;
    }

    // 创建读取文件块的可读流和写入当前块的可写流
    const chunkStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(chunkPath);
    const storageKey = "uploadId." + uploadId + "." + currentIndex;
    store.put(storageKey, res);

    // 将读取的文件块内容通过管道写入当前块的文件
    chunkStream.pipe(writeStream);

    // 监听读取文件块流结束事件
    chunkStream.on("end", () => {
      store.remove(storageKey);
      fs.unlinkSync(file.path); // 读取文件块的流结束后，删除临时文件
      const progress = ((currentIndex + 1) / totalChunks) * 100; //计算上传进度
      res.json({ data: { progress } }); // 响应上传成功的状态码
    });
  });

  // 处理文件合并的路由
  router.post("/api/upload/merge", (req, res) => {
    const { totalChunks, uploadId, filename } = req.body;

    // 生成合并后文件的存储路径
    const mergedPath = path.join(
      __dirname,
      UPLOAD_PATH,
      uploadId,
      "/" + filename
    );

    // 创建写入合并后文件的可写流
    const writeStream = fs.createWriteStream(mergedPath);

    // 递归合并文件块的函数
    const mergeChunks = (index) => {
      if (index === +totalChunks) {
        writeStream.end(); // 所有块都合并完成后，关闭写入流
        res.json({
          data: {
            data: { objectKey: UPLOAD_PATH + uploadId + "/" + filename },
          },
        }); // 响应合并成功的状态
        return;
      }

      // 获取当前块的存储路径
      const chunkPath = path.join(
        __dirname,
        UPLOAD_PATH,
        uploadId,
        `chunk-${index}`
      );

      if (!fs.existsSync(chunkPath)) {
        res.status(500).json({ msg: "文件不存在" }); // 响应合并成功的状态
        return;
      }

      // 同步读取当前块的内容
      const chunk = fs.readFileSync(chunkPath);
      // 删除已合并的块
      fs.unlinkSync(chunkPath);

      // 将块的内容写入合并后文件，并在写入完成后递归合并下一块
      writeStream.write(chunk, () => {
        mergeChunks(index + 1);
      });
    };

    // 开始递归合并文件块
    mergeChunks(0);
  });

  // 处理文件合并的路由
  router.post("/api/upload/cancel", (req, res) => {
    const { uploadId } = req.body;
    store
      .filterStart("uploadId." + uploadId + ".")
      .forEach(([storageKey, _res]) => {
        store.remove([storageKey]);
        _res.status(500).json({ msg: "请求已取消" });
      });
    return res.json({ data: { data: null } });
  });
};

module.exports = initUploadApi;
