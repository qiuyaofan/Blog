const loadScript = async (src: string) => {
  const scriptLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.type = 'module';
    script.src = src;
  });
  await scriptLoader;
};

const loadPdfJsScript = async () => {
  if (window.pdfjsLib) {
    return;
  }
  await loadScript('/pdfjs/pdf.mjs');
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.mjs';
};
const getCanvasByPage = (page: any) => {
  // 渲染每一页到画布上
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  return page
    .render({
      canvasContext: canvas.getContext('2d'),
      viewport: viewport,
    })
    .promise.then(function () {
      return canvas;
    });
};
const getPdfAllCanvas = (pdf: any) => {
  // 获取PDF文件的所有页面
  const pageNumbers = Array.from(new Array(pdf.numPages), (val, index) => index + 1);
  return Promise.all(
    pageNumbers.map((num) => {
      return pdf.getPage(num).then((page: any) => getCanvasByPage(page));
    }),
  );
};

export const getCombinedCanvas = (canvass: HTMLCanvasElement[]) => {
  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = Math.max(...canvass.map((shot) => shot.width));
  combinedCanvas.height = canvass.reduce((sum, shot) => sum + shot.height, 0);

  let yPosition = 0;
  canvass.forEach((shot) => {
    combinedCanvas.getContext('2d')?.drawImage(shot, 0, yPosition);
    yPosition += shot.height;
  });
  return combinedCanvas;
};

export const pdfToCanvas = async (
  options: { data?: any; url?: string } = {},
): Promise<HTMLCanvasElement[] | undefined> => {
  await loadPdfJsScript();
  const { data, url } = options;
  if (!data && !url) {
    console.error('请传入pdf参数');
    return;
  }
  let pdf;
  // cMapUrl：解决有些显示错误的问题，需要可以加上，文件太多了，就不加上了
  if (url) {
    pdf = await window.pdfjsLib.getDocument({ url }).promise;
  } else if (data) {
    pdf = await window.pdfjsLib.getDocument({ data }).promise;
  }
  if (!pdf) return;
  const canvass = await getPdfAllCanvas(pdf);
  //   canvass.forEach((canvas) => document.body.appendChild(canvas));
  return canvass;
};
export const pdfToImages = async (
  options: { data?: any; url?: string } = {},
): Promise<string[] | undefined> => {
  const canvass = await pdfToCanvas(options);
  return canvass?.map((canvas) => canvas.toDataURL());
};
