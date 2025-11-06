<template>
  <div class="collapsible-card">
    <div class="card-header">
      <button class="toggle-btn" @click="toggle">
        <span class="arrow" :class="{ expanded: isExpanded }">▼</span>
      </button>
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <div class="card-body" :class="{ collapsed: !isExpanded, expanded: isExpanded }">
      <div class="progress-item" v-for="item in items" :key="item.id">
        <div class="item-label">{{ item.label }}</div>
        
        <div class="progress-track">
          <div class="progress-line">
            <div 
              class="progress-line-fill"
              :style="{ width: getProgressWidth(item.currentStep, item.nodes.length) + '%' }"
            ></div>
          </div>
          
          <div class="progress-nodes">
            <div 
              class="node" 
              v-for="(node, index) in item.nodes" 
              :key="index"
            >
              <div 
                class="node-circle"
                :class="getNodeStatus(index, item.currentStep)"
              ></div>
              <span 
                class="node-label"
                :class="getNodeStatus(index, item.currentStep)"
              >{{ node }}</span>
            </div>
          </div>
        </div>
        
        <div class="status-indicator">
          <component 
            :is="statusConfig[item.status]?.icon" 
            class="status-icon" 
            :style="{ color: statusConfig[item.status]?.color }"
          />
          <span class="status-text" :class="item.status">{{ item.statusText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('季度專案進度');
const items = ref([
  {
    id: 'proj-a',
    label: '核心引擎升級',
    currentStep: 2,
    nodes: ['規劃', '設計', '開發', '測試', '部署'],
    status: 'running',
    statusText: '進行中'
  },
  {
    id: 'proj-b',
    label: '使用者介面重構',
    currentStep: 4,
    nodes: ['需求分析', '原型設計', 'UI/UX 設計', '前端開發', '整合測試'],
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 'proj-c',
    label: '後端 API 優化',
    currentStep: 1,
    nodes: ['效能分析', '重構', '壓力測試', '上線'],
    status: 'pending',
    statusText: '待開始'
  },
  {
    id: 'proj-d',
    label: '文件系統遷移',
    currentStep: 0,
    nodes: ['評估', '遷移', '驗證'],
    status: 'paused',
    statusText: '已暫停'
  }
]);

const isExpanded = ref(true);

const statusConfig = {
  running: { icon: 'Loading', color: '#4CAF50' },
  completed: { icon: 'CircleCheck', color: '#2196F3' },
  pending: { icon: 'Clock', color: '#FF9800' },
  paused: { icon: 'VideoPause', color: '#9E9E9E' }
};

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const getNodeStatus = (nodeIndex, currentStep) => {
  if (nodeIndex < currentStep) {
    return 'completed';
  } else if (nodeIndex === currentStep) {
    return 'active';
  }
  return 'pending';
};

const getProgressWidth = (currentStep, totalSteps) => {
  return (currentStep / (totalSteps - 1)) * 100;
};
</script>

<style scoped>
.collapsible-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  user-select: none;
  transition: background 0.2s;
}

.card-header:hover {
  background: #e9ecef;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.toggle-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  margin-right: 12px;
}

.toggle-btn:hover {
  color: #333;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.arrow.expanded {
  transform: rotate(180deg);
}

.card-body {
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.card-body.collapsed {
  max-height: 0;
  padding: 0;
}

.card-body.expanded {
  max-height: 2000px;
  padding: 20px;
}

.progress-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  min-height: 80px;
}

.progress-item:last-child {
  border-bottom: none;
}

.item-label {
  width: 33.33%;
  font-size: 15px;
  color: #333;
  font-weight: 500;
  padding-right: 20px;
  flex-shrink: 0;
}

.progress-track {
  width: 33.33%;
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  height: 4px;
  background: #e9ecef;
  transform: translateY(-50%);
  border-radius: 2px;
}

.progress-line-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
  transition: width 0.5s ease;
  border-radius: 2px;
}

.progress-nodes {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.node-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  border: 3px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
}

.node-circle.active {
  background: #4CAF50;
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
  animation: pulse-node 2s infinite;
}

.node-circle.completed {
  background: #4CAF50;
  border-color: #4CAF50;
}

.node-circle.completed::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 11px;
  font-weight: bold;
}

@keyframes pulse-node {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
}

.node-label {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  transition: color 0.3s ease;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-label.active {
  color: #4CAF50;
  font-weight: 600;
}

.node-label.completed {
  color: #666;
}

.status-indicator {
  width: 33.33%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
}

.status-icon {
  width: 18px;
  height: 18px;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
}

.status-text.running {
  color: #4CAF50;
}

.status-text.pending {
  color: #FF9800;
}

.status-text.completed {
  color: #2196F3;
}

.status-text.paused {
  color: #9E9E9E;
}

@media (max-width: 992px) {
  .progress-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 16px;
  }

  .item-label,
  .progress-track,
  .status-indicator {
    width: 100%;
  }

  .status-indicator {
    justify-content: flex-start;
  }
}
</style>