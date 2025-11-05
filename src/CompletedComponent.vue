<template>
  <div class="completed-component">
    <h3>🎉 流程已完成</h3>
    
    <div class="success-message">
      <div class="success-icon">✓</div>
      <p>该流程已成功完成所有审批环节</p>
    </div>

    <div class="info-section">
      <h4>申请信息</h4>
      <div class="info-item">
        <strong>标题：</strong>
        <span>{{ data.title }}</span>
      </div>
      <div class="info-item">
        <strong>内容：</strong>
        <p>{{ data.content }}</p>
      </div>
      <div class="info-item">
        <strong>创建时间：</strong>
        <span>{{ data.createTime }}</span>
      </div>
      <div class="info-item">
        <strong>完成时间：</strong>
        <span>{{ data.updateTime }}</span>
      </div>
    </div>

    <div class="info-section">
      <h4>审核记录</h4>
      <div class="info-item">
        <strong>审核意见：</strong>
        <p>{{ data.reviewComment || '无' }}</p>
      </div>
      <div class="info-item">
        <strong>批准意见：</strong>
        <p>{{ data.approvalComment || '无' }}</p>
      </div>
    </div>

    <div class="button-group">
      <button @click="handleExport" class="btn btn-primary">导出记录</button>
      <button @click="handlePrint" class="btn btn-secondary">打印</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: true
  }
})

const handleExport = () => {
  alert('导出功能：将导出完整的流程记录')
  console.log('导出数据：', props.data)
}

const handlePrint = () => {
  alert('打印功能：将打印完整的流程记录')
  window.print()
}
</script>

<style scoped>
.completed-component {
  padding: 20px;
}

h3 {
  color: #333;
  margin-bottom: 20px;
}

h4 {
  color: #555;
  margin-bottom: 15px;
  font-size: 16px;
}

.success-message {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 8px;
  color: white;
  margin-bottom: 30px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: white;
  color: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: bold;
  margin: 0 auto 15px;
}

.success-message p {
  font-size: 18px;
  margin: 0;
}

.info-section {
  background-color: #fafafa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item strong {
  color: #333;
  margin-right: 8px;
}

.info-item p {
  margin: 8px 0 0 0;
  color: #666;
  line-height: 1.6;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>