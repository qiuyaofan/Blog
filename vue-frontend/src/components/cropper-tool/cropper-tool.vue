<script lang="ts" setup>
// 截图文档：https://github.com/xyxiao001/vue-cropper
import 'vue-cropper/dist/index.css';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { VueCropper } from 'vue-cropper';
export interface Props {
  img: string;
  outputType?: string;
  outputSize?: number;
}

export interface CropData {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  base64: string;
  cropW: number;
  cropH: number;
  w: number;
  h: number;
}
export interface ImageSizeData {
  w: number;
  h: number;
}
const emit = defineEmits<{
  crop: [CropData];
  loaded: [ImageSizeData];
}>();
const props = defineProps<Props>();
const cropperRef = ref();
const DEFAULT_CONFIG = {
  canScale: false, // 图片是否允许滚轮缩放
  canMove: false, // 上传图片是否可以移动
  centerBox: true, // 截图框是否被限制在图片里面
};

const isShowTool = ref(false);
const toolStyle = ref();

var handleRealTime = () => {
  // 开始操作隐藏工具栏
  if (isShowTool.value) {
    isShowTool.value = false;
  }
};
const changeCropEnd = () => {
  const { cropW, cropH, w } = cropperRef.value;
  if (!(cropW > 0 && cropH > 0)) {
    return;
  }
  const { x2, y2 } = cropperRef.value.getCropAxis();
  toolStyle.value = `top: ${y2}px; right: ${w - x2}px`;
  isShowTool.value = true;
};

const handleConfirm = () => {
  const cropAxis = cropperRef.value.getCropAxis();
  const { x1, x2, y1, y2 } = cropAxis;
  const { cropW, cropH, w, h, scale, trueWidth, trueHeight } = cropperRef.value;
  cropperRef.value.getCropData((data: string) => {
    const params = {
      ...cropAxis,
      cropW,
      cropH,
      w,
      h,
    };
    const originData = Object.fromEntries(
      Object.entries(params).map((item: any[]) => [item[0], item[1] / scale]),
    );
    emit('crop', {
      base64: data,
      ...params,
      scale,
      originData: {
        ...originData,
        w: trueWidth,
        h: trueHeight,
        scale: 1,
      },
      ratioData: {
        x1: x1 / w,
        x2: x2 / w,
        y1: y1 / h,
        y2: y2 / h,
        cropW: cropW / w,
        cropH: cropW / h,
      },
    });
    cropperRef.value.clearCrop();
  });
};

const handleCancel = () => {
  cropperRef.value.clearCrop();
};

const handleImgLoad = () => {
  const { trueWidth, trueHeight } = cropperRef.value;
  emit('loaded', {
    w: trueWidth,
    h: trueHeight,
  });
};

onMounted(() => {
  cropperRef.value.startCrop();
  window.addEventListener('mouseup', changeCropEnd);
});

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', changeCropEnd);
});
</script>
<template>
  <div class="cropper-tool">
    <vueCropper
      ref="cropperRef"
      v-bind="DEFAULT_CONFIG"
      :img="img"
      :outputSize="outputSize"
      :outputType="outputType"
      mode="cover"
      @realTime="handleRealTime"
      @imgLoad="handleImgLoad"
    ></vueCropper>
    <div class="tool-main" v-show="isShowTool" :style="toolStyle">
      <div class="ok-btn" @click="handleConfirm"><check-outlined /></div>
      <div class="cancel-btn" @click="handleCancel"><close-outlined /></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cropper-tool {
  width: 100%;
  height: 100%;
  position: relative;
}
.tool-main {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: #5a5a5a;
  z-index: 2;
  gap: 5px;
  & > div {
    padding: 0 5px;
    cursor: pointer;
  }
  .ok-btn {
    color: #52c41a;
  }
  .cancel-btn {
    color: #f5222d;
  }
}
</style>
