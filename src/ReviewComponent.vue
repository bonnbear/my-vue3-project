<template>
  <div class="review-component">
    <h3>🔍 审核阶段</h3>
    
    <!-- 显示原始内容 -->
    <div class="info-section">
      <h4>申请内容</h4>
      <div class="info-item">
        <strong>标题：</strong>
        <span>{{ data.title }}</span>
      </div>
      <div class="info-item">
        <strong>内容：</strong>
        <p>{{ data.content }}</p>
      </div>
    </div>

    <!-- 审核意见 -->
    <div v-if="!readonly" class="form-group">
      <label>审核意见：</label>
      <textarea 
        v-model="localData.reviewComment"
        placeholder="请输入审核意见"
        class="form-textarea"
        rows="4"
      ></textarea>
    </div>

    <div v-else class="info-section">
      <h4>审核意见</h4>
      <p>{{ data.reviewComment || '暂无审核意见' }}</p>
    </div>

    <div v-if="!readonly" class="button-group">
      <button @click="handleSave" class="btn btn-secondary">保存</button>
      <button @click="handleReject" class="btn btn-danger">驳回</button>
      <button @click="handleSubmit" class="btn btn-primary">通过并提交批准</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'save'])

const localData = ref({
  reviewComment: props.data.reviewComment || ''
})

watch(() => props.data, (newData) => {
  localData.value.reviewComment = newData.reviewComment || ''
}, { deep: true })

const handleSave = () => {
  emit('save', localData.value)
}

const handleSubmit = () => {
  if (!localData.value.reviewComment) {
    alert('请填写审核意见')
    return
  }
  emit('submit', { ...localData.value, reviewStatus: 'approved' })
}

const handleReject = () => {
  if (!localData.value.reviewComment) {
    alert('请填写驳回原因')
    return
  }
  if (confirm('确认驳回吗？')) {
    emit('save', { ...localData.value, reviewStatus: 'rejected' })
    alert('已驳回')
  }
}
</script>

<style scoped>
.review-component {
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

.info-section {
  background-color: #fafafa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 12px;
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
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
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background-color: #ff7875;
}
</style>