<template>
  <div class="workflow-wrapper">
    <!-- 模拟按ID查询 -->
    <div class="search-bar">
      <input v-model="processIdInput" type="text" placeholder="输入流程ID (例如: proc-001, proc-002)">
      <button @click="loadProcessDetails">查询详情</button>
    </div>

    <!-- 流程状态条 -->
    <ol class="workflow-steps">
      <li 
        v-for="(step, index) in steps" 
        :key="step.id"
        :class="getStepClass(step, index)"
        @click="handleStepClick(step.id)"
      >
        <div class="step-node">
          <span class="step-index">{{ index + 1 }}</span>
        </div>
        <span class="step-title">{{ step.title }}</span>
      </li>
    </ol>

    <!-- 动态组件渲染区域 -->
    <div class="component-view">
      <h3 class="current-step-title">当前状态: {{ currentStepInfo.title }}</h3>
      <div class="component-content">
        <!-- 
          使用 Vue 内置的 <component> 元素
          :is 属性绑定一个计算属性，动态决定渲染哪个组件
          @next 和 @back 监听子组件发出的事件，用于更新状态
          :process-data 将当前流程的数据传递给子组件
        -->
        <keep-alive>
          <component 
            :is="currentComponent" 
            :process-data="processData"
            @next="handleNextStep" 
            @back="handlePrevStep"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, shallowRef } from 'vue';

// 导入各个步骤对应的组件
import Step1Draft from './workflow/Step1Draft.vue';
import Step2Review from './workflow/Step2Review.vue';
import Step3Approved from './workflow/Step3Approved.vue';
import Step4Finished from './workflow/Step4Finished.vue';

// 1. 定义流程的所有步骤
const steps = ref([
  { id: 1, title: '起草申请', component: 'Step1Draft' },
  { id: 2, title: '部门审核', component: 'Step2Review' },
  { id: 3, title: '审批通过', component: 'Step3Approved' },
  { id: 4, title: '流程完结', component: 'Step4Finished' },
]);

// 使用 shallowRef 存储组件，因为组件本身不需要深度响应式，可以优化性能
const stepComponentMap = shallowRef({
  Step1Draft,
  Step2Review,
  Step3Approved,
  Step4Finished,
});

// 2. 管理当前状态
// 当前激活的步骤ID
const currentStepId = ref(1); 
// 用于查询的输入框模型
const processIdInput = ref('');
// 存储当前流程的数据，这个对象会作为 prop 传递给子组件
const processData = reactive({
  id: 'new-proc-' + Date.now(),
  title: '',
  reason: '',
  reviewerComment: '',
  approver: '',
  status: 'draft',
});

// 模拟一个数据库，用于存储不同ID的流程进度
const mockProcessDB = {
  'proc-001': {
    currentStepId: 2,
    data: { id: 'proc-001', title: '采购笔记本电脑', reason: '开发人员配置升级', reviewerComment: '', approver: '', status: 'reviewing' }
  },
  'proc-002': {
    currentStepId: 3,
    data: { id: 'proc-002', title: '申请团建费用', reason: '季度部门活动', reviewerComment: '预算合理，同意。', approver: '张三', status: 'approved' }
  },
};

// 3. 计算属性
// 计算当前步骤的索引，用于样式判断
const currentStepIndex = computed(() => {
  return steps.value.findIndex(step => step.id === currentStepId.value);
});

// 计算当前步骤的完整信息
const currentStepInfo = computed(() => {
  return steps.value[currentStepIndex.value];
});

// 核心：计算当前应该显示哪个组件
const currentComponent = computed(() => {
  const componentName = currentStepInfo.value.component;
  return stepComponentMap.value[componentName];
});

// 4. 方法
// 获取步骤条的CSS类
const getStepClass = (step, index) => {
  if (index < currentStepIndex.value) {
    return 'completed'; // 已完成
  } else if (index === currentStepIndex.value) {
    return 'active'; // 当前
  } else {
    return 'upcoming'; // 未开始
  }
};

// 处理点击步骤条的事件
const handleStepClick = (stepId) => {
  // 只有已完成或当前步骤可以点击查看
  const targetIndex = steps.value.findIndex(step => step.id === stepId);
  if (targetIndex <= currentStepIndex.value) {
    currentStepId.value = stepId;
  } else {
    // 可以给个提示，或者不做任何事
    console.log("不能查看未来的步骤！");
  }
};

// 前进到下一步
const handleNextStep = (dataFromChild) => {
  // 更新流程数据
  Object.assign(processData, dataFromChild);
  
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepId.value++;
    // 更新状态文本
    processData.status = steps.value[currentStepId.value - 1].title;
  }
  console.log('流程数据已更新:', JSON.parse(JSON.stringify(processData)));
};

// 回退到上一步（例如：驳回）
const handlePrevStep = (dataFromChild) => {
  // 更新流程数据
  Object.assign(processData, dataFromChild);

  if (currentStepIndex.value > 0) {
    currentStepId.value--;
    // 更新状态文本
    processData.status = steps.value[currentStepId.value - 1].title;
  }
  console.log('流程被驳回，数据已更新:', JSON.parse(JSON.stringify(processData)));
};

// 加载流程详情
const loadProcessDetails = () => {
  const id = processIdInput.value;
  if (mockProcessDB[id]) {
    const loadedProcess = mockProcessDB[id];
    currentStepId.value = loadedProcess.currentStepId;
    // 使用 Object.assign 更新 reactive 对象
    Object.assign(processData, loadedProcess.data);
    alert(`已成功加载流程 ${id} 的详情！`);
  } else {
    alert(`未找到ID为 ${id} 的流程，将显示新流程。`);
    // 如果找不到，可以重置为新流程
    currentStepId.value = 1;
    Object.assign(processData, {
      id: 'new-proc-' + Date.now(),
      title: '',
      reason: '',
      reviewerComment: '',
      approver: '',
      status: 'draft',
    });
  }
};
</script>

<style scoped>
.workflow-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}
.search-bar input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-bar button {
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.search-bar button:hover {
  background-color: #0056b3;
}

.workflow-steps {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 40px;
  position: relative;
}

/* 步骤之间的连接线 */
.workflow-steps::before {
  content: '';
  position: absolute;
  top: 15px; /* 调整到节点中心 */
  left: 30px;
  right: 30px;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 0;
}

.workflow-steps li {
  flex: 1;
  text-align: center;
  position: relative;
  cursor: pointer;
  z-index: 1;
}

.step-node {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #888;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
  border: 2px solid #e0e0e0;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-title {
  font-size: 14px;
  color: #888;
}

/* 已完成状态 */
.workflow-steps li.completed .step-node {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}
.workflow-steps li.completed .step-title {
  color: #333;
}
.workflow-steps li.completed::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #28a745;
  z-index: -1;
}
.workflow-steps li:first-child.completed::after {
  width: 50%;
}
.workflow-steps li:last-child.completed::after {
  width: 50%;
  left: 0;
}


/* 当前激活状态 */
.workflow-steps li.active .step-node {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  transform: scale(1.1);
}
.workflow-steps li.active .step-title {
  color: #007bff;
  font-weight: bold;
}
.workflow-steps li.active::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  width: 50%;
  height: 2px;
  background-color: #28a745;
  z-index: -1;
}

.component-view {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.current-step-title {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
</style>