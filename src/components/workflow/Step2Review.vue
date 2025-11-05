<template>
  <div class="step-form">
    <div class="info-display">
      <p><strong>申请标题:</strong> {{ processData.title }}</p>
      <p><strong>申请事由:</strong> {{ processData.reason }}</p>
    </div>
    <div class="form-group">
      <label for="comment">审核意见</label>
      <textarea id="comment" v-model="formData.reviewerComment" rows="4" placeholder="请输入审核意见"></textarea>
    </div>
    <div class="actions">
      <button @click="reject" class="btn-danger">驳回</button>
      <button @click="approve" class="btn-primary">批准</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  processData: Object
});

const emit = defineEmits(['next', 'back']);

const formData = ref({ ...props.processData });

watch(() => props.processData, (newData) => {
  formData.value = { ...newData };
}, { deep: true });

const approve = () => {
  if (!formData.value.reviewerComment) {
    formData.value.reviewerComment = '同意。'; // 默认意见
  }
  emit('next', formData.value);
};

const reject = () => {
  if (!formData.value.reviewerComment) {
    alert('驳回时必须填写意见！');
    return;
  }
  emit('back', formData.value);
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