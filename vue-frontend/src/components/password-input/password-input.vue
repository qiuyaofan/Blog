<script lang="ts" setup>
// 组件参考来源：https://github.com/lxmghct/my-vue-components/blob/main/src/components/PasswordInput/PasswordInput2.vue
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { useVModel } from '@vueuse/core';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
export interface Props {
  value: string;
}
const emit = defineEmits<{
  'update:value': [Props['value']];
}>();
const props = defineProps<Props>();
const vmodelValue = useVModel(props, 'value', emit);
const toDot = (value: string) => '\u2022'.repeat(value.length);
const displayValue = ref(toDot(props.value));
const isPreview = ref(false);
// 更新输入值为密码格式
const updateDisplay = (value: string) => {
  if (isPreview.value) {
    displayValue.value = value;
  } else {
    displayValue.value = toDot(value); // 圆点
  }
  const end = inputRef.value.input.selectionEnd;
  const start = inputRef.value.input.selectionStart;
  // 更新值后，光标自动跑到最后，手动更新回原本的位置
  nextTick(() => {
    inputRef.value.input.setSelectionRange(start, end);
    selection.start = start;
    selection.end = end;
  });
};
// 处理输入变化
const handleChange = (e: any) => {
  /*
     修改前的数据：vmodelValue.value， selection.start, selection.end
     修改后的数据：e.target.value， inputRef.value.input.selectionEnd， inputRef.value.input.selectionEnd
     */
  const currentStart = inputRef.value.input.selectionStart;
  const currentValue = e.target.value;
  const originValue = vmodelValue.value;
  // 获取新输入的字符
  const tempEnd = currentValue.length - (originValue.length - selection.end);
  const newStr = currentValue.slice(selection.start, tempEnd);

  // 更新输入框的值
  vmodelValue.value =
    originValue.slice(0, Math.min(selection.start, currentStart)) +
    newStr +
    originValue.slice(selection.end);
};

const inputRef = ref();
const isSelect = ref(false);
const selection = reactive({
  start: 0,
  end: 0,
});

onMounted(() => {
  document.addEventListener('selectionchange', (e: any) => {
    if (!isSelect.value) return;
    selection.start = inputRef.value.input.selectionStart;
    selection.end = inputRef.value.input.selectionEnd;
  });
});
// 用于实现当前输入框的selectionchange
const handleFocus = () => {
  isSelect.value = true;
};
const handleBlur = () => {
  isSelect.value = false;
};
const visibilityToggle = () => {
  isPreview.value = !isPreview.value;
};
watch(
  () => vmodelValue.value,
  (value: string) => updateDisplay(value),
);
watch(
  () => isPreview.value,
  () => updateDisplay(vmodelValue.value),
);
</script>
<template>
  <div class="password-main">
    <a-input
      ref="inputRef"
      v-model:value="displayValue"
      placeholder="请输入"
      autocomplete="off"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template #suffix>
        <eye-outlined v-if="isPreview" @click="visibilityToggle" />
        <eye-invisible-outlined v-else @click="visibilityToggle" />
      </template>
    </a-input>
  </div>
</template>
<style lang="scss" scoped>
.password-main {
}
</style>
