<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import CropperTool, { type CropData } from '@/components/cropper-tool/cropper-tool.vue';

import examPdf from './assets/1.pdf';
import { EXAM_TYPE_KEYS, type ExamTypeKeysType, useCropExam } from './utils';

const { initCrop, setPreviewData, previewSrc, questions } = useCropExam();

// 处理需要按比例缩放的情况
const paperWidth = 800;
const getCropperStyle = (width: number, height: number) => {
  return `width: ${paperWidth}px; height: ${(paperWidth * height) / width}px;`;
  // return `width: ${width}px; height: ${height}px;`;
};

const handleCrop = (data: CropData, index: number, type: ExamTypeKeysType) => {
  setPreviewData(data.base64, index, type);
};

initCrop(examPdf);
</script>
<template>
  <div class="layout-content">
    <div class="question-main" v-for="(imgs, index) in questions" :key="index">
      <div v-for="typeKey in EXAM_TYPE_KEYS" :key="typeKey" class="flex-main">
        <div>
          <div
            v-for="(img, imgIndex) in imgs[typeKey]"
            :key="imgIndex"
            class="cropper-main"
            :style="getCropperStyle(img.width, img.height)"
          >
            <CropperTool
              :img="img.url"
              @crop="(data: CropData) => handleCrop(data, index, typeKey)"
            ></CropperTool>
          </div>
        </div>
        <div>
          <h2>预览截图</h2>
          <img
            class="preview"
            v-if="previewSrc[index]?.[typeKey]"
            :src="previewSrc[index][typeKey]"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.layout-content {
  .cropper-main {
    border: 1px solid red;
    // width: 400px;
    // height: 800px;
  }
  .flex-main {
    display: flex;
    gap: 0 20px;
  }
}
</style>
