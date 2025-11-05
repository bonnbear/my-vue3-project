<template>
  <div class="step-form finished-view">
    <h4>流程已完结</h4>
    <div class="info-display">
      <p><strong>流程ID:</strong> {{ processData.id }}</p>
      <p><strong>申请标题:</strong> {{ processData.title }}</p>
      <p><strong>申请事由:</strong> {{ processData.reason }}</p>
      <p><strong>审核意见:</strong> {{ processData.reviewerComment }}</p>
      <p><strong>最终批准人:</strong> {{ processData.approver }}</p>
    </div>
    <p>此流程的所有步骤均已完成。</p>
  </div>
</template>

<script setup>
defineProps({
  processData: Object
});
</script>

<style scoped>
@import './form-styles.css';
.finished-view {
  text-align: center;
}
.info-display {
  text-align: left;
  margin-top: 20px;
  background-color: #e9f5ec;
  border-left: 4px solid #28a745;
}
.info-display p {
  margin: 8px 0;
}
</style>