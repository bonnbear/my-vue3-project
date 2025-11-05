<template>
  <div class="step-form">
    <div class="info-display">
      <p><strong>申请标题:</strong> {{ processData.title }}</p>
      <p><strong>申请事由:</strong> {{ processData.reason }}</p>
      <p><strong>审核意见:</strong> {{ processData.reviewerComment }}</p>
    </div>
    <div class="form-group">
      <label for="approver">最终批准人</label>
      <input id="approver" type="text" v-model="formData.approver" placeholder="请输入批准人姓名">
    </div>
    <div class="actions">
      <button @click="finish" class="btn-success">完结流程</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  processData: Object
});

const emit = defineEmits(['next']);

const formData = ref({ ...props.processData });

watch(() => props.processData, (newData) => {
  formData.value = { ...newData };
}, { deep: true });

const finish = () => {
  if (!formData.value.approver) {
    alert('请输入最终批准人！');
    return;
  }
  emit('next', formData.value);
};
</script>

<style scoped>
@import './form-styles.css';
.info-display {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
.info-display p {
  margin: 5px 0;
}
</style>