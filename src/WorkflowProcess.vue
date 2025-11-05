<template>
  <div class="workflow-container">
    <h2>工作流程管理</h2>
    
    <!-- 流程步骤条 -->
    <div class="steps-container">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        class="step-item"
        :class="{
          'active': currentStep === index,
          'completed': currentStep > index,
          'disabled': !canAccessStep(index)
        }"
        @click="handleStepClick(index)"
      >
        <div class="step-number">
          <span v-if="currentStep > index">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-label">{{ step.label }}</div>
        <div v-if="index < steps.length - 1" class="step-line"></div>
      </div>
    </div>

    <!-- 动态组件显示区域 -->
    <div class="component-container">
      <component 
        :is="currentComponent" 
        :data="formData"
        :readonly="!canEditCurrentStep"
        @submit="handleSubmit"
        @save="handleSave"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button 
        v-if="currentStep > 0 && canEditCurrentStep" 
        @click="handlePrevious"
        class="btn btn-secondary"
      >
        上一步
      </button>
      
      <button 
        v-if="canEditCurrentStep && currentStep < steps.length - 1"
        @click="handleNext"
        class="btn btn-primary"
      >
        提交到下一步
      </button>
      
      <button 
        v-if="currentStep === steps.length - 1 && canEditCurrentStep"
        @click="handleComplete"
        class="btn btn-success"
      >
        完成流程
      </button>
    </div>

    <!-- 权限提示 -->
    <div v-if="!canEditCurrentStep" class="permission-tip">
      <span>⚠️ 您没有权限操作当前步骤</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import DraftComponent from './DraftComponent.vue'
import ReviewComponent from './ReviewComponent.vue'
import ApprovalComponent from './ApprovalComponent.vue'
import CompletedComponent from './CompletedComponent.vue'

// Props
const props = defineProps({
  workflowId: {
    type: String,
    default: null
  },
  userRole: {
    type: String,
    default: 'user' // 可选值: 'user', 'reviewer', 'approver', 'admin'
  }
})

// 流程步骤配置
const steps = [
  { 
    id: 'draft', 
    label: '草稿', 
    component: markRaw(DraftComponent),
    allowedRoles: ['user', 'reviewer', 'approver', 'admin']
  },
  { 
    id: 'review', 
    label: '审核中', 
    component: markRaw(ReviewComponent),
    allowedRoles: ['reviewer', 'approver', 'admin']
  },
  { 
    id: 'approval', 
    label: '批准', 
    component: markRaw(ApprovalComponent),
    allowedRoles: ['approver', 'admin']
  },
  { 
    id: 'completed', 
    label: '已完成', 
    component: markRaw(CompletedComponent),
    allowedRoles: ['user', 'reviewer', 'approver', 'admin']
  }
]

// 响应式数据
const currentStep = ref(0)
const formData = ref({
  title: '',
  content: '',
  reviewComment: '',
  approvalComment: '',
  createTime: '',
  updateTime: ''
})

// 计算当前组件
const currentComponent = computed(() => {
  return steps[currentStep.value].component
})

// 权限检查：是否可以访问某个步骤
const canAccessStep = (stepIndex) => {
  const step = steps[stepIndex]
  return step.allowedRoles.includes(props.userRole)
}

// 权限检查：是否可以编辑当前步骤
const canEditCurrentStep = computed(() => {
  return canAccessStep(currentStep.value)
})

// 步骤点击处理
const handleStepClick = (stepIndex) => {
  // 只能查看已完成的步骤或当前步骤
  if (stepIndex <= currentStep.value && canAccessStep(stepIndex)) {
    currentStep.value = stepIndex
  }
}

// 保存数据
const handleSave = (data) => {
  formData.value = { ...formData.value, ...data }
  formData.value.updateTime = new Date().toLocaleString()
  console.log('保存数据:', formData.value)
  alert('保存成功！')
}

// 提交到下一步
const handleSubmit = (data) => {
  if (!canEditCurrentStep.value) {
    alert('您没有权限操作当前步骤')
    return
  }
  
  formData.value = { ...formData.value, ...data }
  formData.value.updateTime = new Date().toLocaleString()
  
  // 保存到后端
  saveToBackend()
  
  // 移动到下一步
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    alert(`已提交到 ${steps[currentStep.value].label}`)
  }
}

// 下一步
const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

// 上一步（仅查看）
const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 完成流程
const handleComplete = () => {
  if (!canEditCurrentStep.value) {
    alert('您没有权限完成流程')
    return
  }
  
  saveToBackend()
  alert('流程已完成！')
}

// 保存到后端（模拟）
const saveToBackend = () => {
  const saveData = {
    workflowId: props.workflowId || generateId(),
    currentStep: currentStep.value,
    stepId: steps[currentStep.value].id,
    data: formData.value
  }
  
  // 模拟保存到localStorage
  localStorage.setItem(`workflow_${saveData.workflowId}`, JSON.stringify(saveData))
  console.log('保存到后端:', saveData)
}

// 从后端加载（模拟）
const loadFromBackend = async () => {
  if (props.workflowId) {
    const saved = localStorage.getItem(`workflow_${props.workflowId}`)
    if (saved) {
      const data = JSON.parse(saved)
      currentStep.value = data.currentStep
      formData.value = data.data
      console.log('加载数据:', data)
    }
  } else {
    // 新建流程
    formData.value.createTime = new Date().toLocaleString()
    formData.value.updateTime = new Date().toLocaleString()
  }
}

// 生成ID
const generateId = () => {
  return 'WF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 组件挂载时加载数据
onMounted(() => {
  loadFromBackend()
})
</script>

<style scoped>
.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 30px;
}

/* 步骤条样式 */
.steps-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.step-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  z-index: 2;
}

.step-item.active .step-number {
  background-color: #1890ff;
  color: white;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);
}

.step-item.completed .step-number {
  background-color: #52c41a;
  color: white;
}

.step-label {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.step-item.active .step-label {
  color: #1890ff;
  font-weight: bold;
}

.step-item.completed .step-label {
  color: #52c41a;
}

.step-line {
  position: absolute;
  top: 25px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.step-item.completed .step-line {
  background-color: #52c41a;
}

/* 组件容器 */
.component-container {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 30px;
  min-height: 300px;
  margin-bottom: 20px;
}

/* 按钮样式 */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
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

.btn-success {
  background-color: #52c41a;
  color: white;
}

.btn-success:hover {
  background-color: #73d13d;
}

/* 权限提示 */
.permission-tip {
  margin-top: 20px;
  padding: 12px;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  color: #d46b08;
  text-align: center;
}
</style>