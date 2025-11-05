<template>
  <div class="step-form">
    <div class="form-group">
      <label for="title">申请标题</label>
      <input id="title" type="text" v-model="formData.title" placeholder="请输入申请标题">
    </div>
    <div class="form-group">
      <label for="reason">申请事由</label>
      <textarea id="reason" v-model="formData.reason" rows="4" placeholder="请详细说明申请事由"></textarea>
    </div>
    <div class="actions">
      <button @click="submit" class="btn-primary">提交审核</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  processData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['next']);

// 使用本地 ref 来处理表单数据，避免直接修改 prop
const formData = ref({ ...props.processData });

// 如果 prop 变化（例如通过ID查询加载了新数据），同步更新本地表单
watch(() => props.processData, (newData) => {
  formData.value = { ...newData };
}, { deep: true });

const submit = () => {
  if (!formData.value.title || !formData.value.reason) {
    alert('请填写完整的申请信息！');
    return;
  }
  // 触发 next 事件，并将更新后的数据传递给父组件
  emit('next', formData.value);
};
</script>

<style scoped>
@import './form-styles.css';
</style>