<template>
  <div class="draft-component">
    <h3>📝 草稿阶段</h3>
    <div class="form-group">
      <label>标题：</label>
      <input 
        v-model="localData.title" 
        :disabled="readonly"
        placeholder="请输入标题"
        class="form-input"
      />
    </div>
    
    <div class="form-group">
      <label>内容：</label>
      <textarea 
        v-model="localData.content"
        :disabled="readonly"
        placeholder="请输入内容"
        class="form-textarea"
        rows="6"
      ></textarea>
    </div>

    <div v-if="!readonly" class="button-group">
      <button @click="handleSave" class="btn btn-secondary">保存草稿</button>
      <button @click="handleSubmit" class="btn btn-primary">提交审核</button>
    </div>

    <div v-else class="readonly-tip">
      <p>📖 查看模式（草稿已提交）</p>
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
  title: props.data.title || '',
  content: props.data.content || ''
})

watch(() => props.data, (newData) => {
  localData.value = {
    title: newData.title || '',
    content: newData.content || ''
  }
}, { deep: true })

const handleSave = () => {
  if (!localData.value.title) {
    alert('请输入标题')
    return
  }
  emit('save', localData.value)
}

const handleSubmit = () => {
  if (!localData.value.title || !localData.value.content) {
    alert('请完整填写标题和内容')
    return
  }
  emit('submit', localData.value)
}
</script>

<style scoped>
.draft-component {
  padding: 20px;
}

h3 {
  color: #333;
  margin-bottom: 20px;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.form-input:disabled,
.form-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
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

.readonly-tip {
  margin-top: 20px;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: #666;
}
</style>