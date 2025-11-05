<template>
  <div id="app">
    <div class="demo-controls">
      <h1>工作流程系统演示</h1>
      
      <div class="control-group">
        <label>选择角色：</label>
        <select v-model="currentRole" class="select-input">
          <option value="user">普通用户</option>
          <option value="reviewer">审核员</option>
          <option value="approver">批准人</option>
          <option value="admin">管理员</option>
        </select>
      </div>

      <div class="control-group">
        <label>工作流ID（留空创建新流程）：</label>
        <input 
          v-model="workflowId" 
          placeholder="例如: WF_123456"
          class="text-input"
        />
      </div>

      <button @click="loadWorkflow" class="btn btn-load">
        {{ workflowId ? '加载流程' : '创建新流程' }}
      </button>
    </div>

    <WorkflowProcess 
      v-if="showWorkflow"
      :key="workflowKey"
      :workflow-id="workflowId"
      :user-role="currentRole"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WorkflowProcess from './WorkflowProcess.vue'

const currentRole = ref('user')
const workflowId = ref('')
const showWorkflow = ref(true)
const workflowKey = ref(0)

const loadWorkflow = () => {
  workflowKey.value++
  showWorkflow.value = false
  setTimeout(() => {
    showWorkflow.value = true
  }, 100)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.demo-controls {
  max-width: 1200px;
  margin: 0 auto 30px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-controls h1 {
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.select-input,
.text-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.btn-load {
  width: 100%;
  padding: 12px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-load:hover {
  background-color: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>