<template>
  <div class="layout-main">
    <a-form :model="formState" ref="formRef" name="account" :rules="rules" labelAlign="left">
      <a-form-item label="查看密码值：">
        {{ formState.password }}
      </a-form-item>
      <a-form-item label="确认密码" name="password" :validateFirst="true">
        <PasswordInput v-model:value="formState.password"></PasswordInput>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import PasswordInput from '@/components/password-input/password-input.vue';
const formState = ref({
  password: '',
});
const formRef = ref();

const rules = {
  password: [{ required: true, message: '请输入密码' }],
};
</script>
<style lang="scss" scoped>
.layout-main {
  padding: 20px;
}
</style>
