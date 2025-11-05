<!-- components/Confirm.vue -->
<template>
  <div class="confirm-mask" @click.self="cancel">
    <div class="confirm-container">
      <div class="confirm-header">
        <span class="confirm-title">{{ title }}</span>
        <span class="confirm-close" @click="cancel">&times;</span>
      </div>
      <div class="confirm-content">{{ content }}</div>
      <div class="confirm-footer">
        <button class="confirm-btn cancel" @click="cancel">
          {{ cancelText }}
        </button>
        <button class="confirm-btn confirm" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.confirm-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.confirm-container {
  background: white;
  border-radius: 4px;
  min-width: 420px;
  padding: 20px;
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.confirm-title {
  font-size: 16px;
  font-weight: bold;
}

.confirm-close {
  cursor: pointer;
  font-size: 20px;
  color: #909399;
}

.confirm-content {
  padding: 10px 0;
  color: #606266;
}

.confirm-footer {
  margin-top: 20px;
  text-align: right;
}

.confirm-btn {
  padding: 8px 20px;
  margin-left: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.confirm-btn.cancel {
  background: #ffffff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.confirm-btn.confirm {
  background: #409eff;
  color: white;
}
</style>