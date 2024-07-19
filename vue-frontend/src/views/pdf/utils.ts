import { ref } from 'vue';

import { pdfToCanvas } from '@/utils/pdf/pdf';
export const EXAM_TYPES = {
  paper: 'paper',
} as const;
export type ExamTypeKeysType = ValueOf<typeof EXAM_TYPES>;
export const EXAM_TYPE_KEYS: ExamTypeKeysType[] = Object.values(EXAM_TYPES);
export const useCropExam = () => {
  interface cropInfo {
    url: string;
    width: number;
    height: number;
  }
  type cropItem = Record<ExamTypeKeysType, cropInfo[]>;
  type PreviewSrc = Record<ExamTypeKeysType, string>;
  const questions = ref<cropItem[]>([]);
  const previewSrc = ref<PreviewSrc[]>([]);
  // 设置裁切后的预览图片
  const setPreviewData = (base64: string, index: number, type: ExamTypeKeysType) => {
    if (!previewSrc.value[index]) {
      previewSrc.value[index] = Object.fromEntries(EXAM_TYPE_KEYS.map((name) => [name, ''])) as any;
    }
    previewSrc.value[index][type] = base64;
  };

  // pdf转化为图片
  const getImgsByPdf = async (url: string) => {
    const _canvass = await pdfToCanvas({
      url: url,
    });
    if (!_canvass?.length) return;
    const _imgs = _canvass.map((canvas) => canvas.toDataURL());
    // 处理需要按比例缩放的情况
    const getSize = (canvas: HTMLCanvasElement) => {
      return {
        width: canvas.width,
        height: canvas.height,
      };
    };
    return _imgs.map((url, index) => ({
      url: url,
      ...getSize(_canvass[index]),
    }));
  };
  // 初始化裁切需要的数据：图片，宽，高
  const initCrop = async (examPdf: string) => {
    const result = await Promise.all([examPdf].map((pdf) => getImgsByPdf(pdf)));
    questions.value = [
      Object.fromEntries(EXAM_TYPE_KEYS.map((name, index) => [name, result[index] || []])) as any,
    ];
  };
  return {
    initCrop,
    setPreviewData,
    previewSrc: previewSrc,
    questions: questions,
  };
};
