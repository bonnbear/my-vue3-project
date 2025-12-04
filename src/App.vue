<template>
  <div id="app-wrapper">
    <div class="demo-container">
      <h1>穿梭框示例</h1>
      <p>点击下方按钮打开穿梭框选择器</p>
      
      <!-- 已选标签预览 -->
      <div class="selected-preview" v-if="checkedNodes.length > 0">
        <span class="preview-label">已选择：</span>
        <el-tag
          v-for="node in checkedNodes"
          :key="node.id"
          :closable="!lockedIdList.includes(node.id)"
          @close="removeTag(node)"
          size="small"
          class="preview-tag"
        >
          {{ node.name }}
        </el-tag>
      </div>
      
      <!-- 打开穿梭框按钮 -->
      <el-button type="primary" @click="dialogVisible = true">
        <Plus style="width: 1em; height: 1em; margin-right: 4px;" />
        选择人员
      </el-button>
      
      <!-- 锁定ID设置 -->
      <div class="locked-ids-area">
        <div class="locked-ids-header">
          <h3>锁定的节点ID列表</h3>
        </div>
        <div class="locked-ids-input">
          <el-input
            v-model="lockedIdsInput"
            placeholder="输入要锁定的ID，用逗号分隔 (例如: 1,3,5)"
            @change="updateLockedIds"
          />
        </div>
        <div class="locked-ids-display" v-if="lockedIdList.length > 0">
          <el-tag
            v-for="id in lockedIdList"
            :key="id"
            class="locked-id-tag"
            size="small"
          >
            ID: {{ id }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 穿梭框弹框 -->
    <el-dialog
      v-model="dialogVisible"
      title="选择人员"
      width="800px"
      :close-on-click-modal="false"
      class="transfer-dialog"
    >
      <div class="transfer-container">
        <!-- 左侧面板：树形结构 -->
        <div class="transfer-panel transfer-panel-left">
          <div class="transfer-panel-header">
            <span class="transfer-panel-title">可选列表</span>
            <span class="transfer-panel-count">{{ totalLeafCount }} 项</span>
          </div>
          <div class="transfer-panel-filter">
            <el-input
              v-model="filterText"
              placeholder="搜索..."
              clearable
              size="small"
            >
              <template #prefix>
                <Search style="width: 1em; height: 1em;" />
              </template>
            </el-input>
          </div>
          <div class="transfer-panel-body">
            <div class="tree-wrapper">
              <ul class="tree-node-root">
                <TreeNode
                  v-for="(node, index) in treeData"
                  v-show="node.visible !== false"
                  :key="node.id"
                  :node="node"
                  :selected-id="selectedNodeId"
                  :locked-ids="lockedIdList"
                  :level="0"
                  @node-click="handleNodeClick"
                  :is-last="index === treeData.length - 1"
                />
              </ul>
            </div>
          </div>
        </div>

        <!-- 中间操作按钮 -->
        <div class="transfer-buttons">
          <el-button
            type="primary"
            :icon="ArrowRight"
            :disabled="!hasUncheckedNodes"
            @click="addAllVisible"
            circle
          />
          <el-button
            type="primary"
            :icon="ArrowLeft"
            :disabled="!hasRemovableNodes"
            @click="removeAllUnlocked"
            circle
          />
        </div>

        <!-- 右侧面板：已选列表 -->
        <div class="transfer-panel transfer-panel-right">
          <div class="transfer-panel-header">
            <div class="transfer-panel-header-left">
              <span class="transfer-panel-title">已选列表</span>
              <span class="transfer-panel-count">{{ checkedNodes.length }} 项</span>
            </div>
            <el-button 
              type="primary" 
              link 
              size="small"
              @click="resetToDefault"
              :disabled="!hasRemovableNodes"
            >
              <RefreshRight style="width: 14px; height: 14px; margin-right: 2px;" />
              恢复默认
            </el-button>
          </div>
          <div class="transfer-panel-body">
            <div class="tags-container" v-if="checkedNodes.length > 0">
              <el-tag
                v-for="node in checkedNodes"
                :key="node.id"
                :closable="!lockedIdList.includes(node.id)"
                @close="removeTag(node)"
                class="selected-tag"
              >
                {{ node.name }}
              </el-tag>
            </div>
            <div v-else class="transfer-empty">
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import TreeNode from './TreeNode.vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

const dialogVisible = ref(false);
const filterText = ref('');
const lockedIdsInput = ref('1,3,5');
const lockedIdList = ref([1, 3, 5]);

// 四層結構的樹資料
const treeData = reactive([
  { 
    id: 100,
    name: '公司总部', 
    isOpen: true, 
    checked: false, 
    children: [
      { 
        id: 110,
        name: '技术部', 
        isOpen: true, 
        checked: false, 
        children: [
          { 
            id: 111,
            name: '前端组', 
            isOpen: true, 
            checked: false, 
            children: [
              { id: 1, name: '张三', type: 'employee', checked: false },
              { id: 2, name: '李四', type: 'employee', checked: false },
              { id: 3, name: '王五', type: 'employee', checked: false }
            ] 
          },
          { 
            id: 112,
            name: '后端组', 
            isOpen: false, 
            checked: false, 
            children: [
              { id: 4, name: '赵六', type: 'employee', checked: false },
              { id: 5, name: '钱七', type: 'employee', checked: false }
            ] 
          },
          { 
            id: 113,
            name: '测试组', 
            isOpen: false, 
            checked: false, 
            children: [
              { id: 6, name: '孙八', type: 'employee', checked: false },
              { id: 7, name: '周九', type: 'employee', checked: false }
            ] 
          }
        ]
      },
      { 
        id: 120,
        name: '产品部', 
        isOpen: false, 
        checked: false, 
        children: [
          { 
            id: 121,
            name: '产品设计组', 
            checked: false, 
            children: [
              { id: 8, name: '吴十', type: 'employee', checked: false },
              { id: 9, name: '郑十一', type: 'employee', checked: false }
            ] 
          },
          { 
            id: 122,
            name: '用户研究组', 
            checked: false, 
            children: [
              { id: 10, name: '冯十二', type: 'employee', checked: false }
            ] 
          }
        ]
      },
      { 
        id: 130,
        name: '运营部', 
        isOpen: false, 
        checked: false, 
        children: [
          { 
            id: 131,
            name: '市场推广组', 
            checked: false, 
            children: [
              { id: 11, name: '陈十三', type: 'employee', checked: false },
              { id: 12, name: '褚十四', type: 'employee', checked: false }
            ] 
          }
        ]
      }
    ]
  },
  { 
    id: 200,
    name: '分公司A', 
    checked: false, 
    children: [
      { 
        id: 210,
        name: '销售部', 
        checked: false, 
        children: [
          { 
            id: 211,
            name: '华东区', 
            checked: false, 
            children: [
              { id: 13, name: '卫十五', type: 'employee', checked: false },
              { id: 14, name: '蒋十六', type: 'employee', checked: false }
            ] 
          },
          { 
            id: 212,
            name: '华南区', 
            checked: false, 
            children: [
              { id: 15, name: '沈十七', type: 'employee', checked: false }
            ] 
          }
        ] 
      }
    ] 
  }
]);

const selectedNodeId = ref(null);

const handleNodeClick = (path) => {
  const clickedNode = path[path.length - 1];
  selectedNodeId.value = clickedNode.name;
};

// --- 更新锁定ID列表 ---
const updateLockedIds = () => {
  const ids = lockedIdsInput.value
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n));
  lockedIdList.value = ids;
  setLockedNodesChecked(treeData, ids);
};

const setLockedNodesChecked = (nodes, ids) => {
  for (const node of nodes) {
    if (ids.includes(node.id)) {
      node.checked = true;
    }
    if (node.children && node.children.length > 0) {
      setLockedNodesChecked(node.children, ids);
    }
  }
};

onMounted(() => {
  setLockedNodesChecked(treeData, lockedIdList.value);
});

// --- Search Logic ---
watch(filterText, (val) => {
  filterTree(treeData, val);
});

const filterTree = (nodes, query) => {
  let hasVisible = false;
  for (const node of nodes) {
    if (!query) {
      node.visible = true;
      if (node.children) {
        filterTree(node.children, query);
      }
      continue;
    }

    let childVisible = false;
    if (node.children) {
      childVisible = filterTree(node.children, query);
    }

    const selfVisible = node.name.toLowerCase().includes(query.toLowerCase());
    node.visible = selfVisible || childVisible;

    if (childVisible) {
      node.isOpen = true;
    }
    
    if (node.visible) hasVisible = true;
  }
  return hasVisible;
};

// --- Checkbox Logic ---
const getCheckedNodes = (nodes) => {
  let checked = [];
  for (const node of nodes) {
    if (node.checked && node.type) {
      checked.push(node);
    }
    if (node.children && node.children.length > 0) {
      checked = checked.concat(getCheckedNodes(node.children));
    }
  }
  return checked;
};

const checkedNodes = computed(() => {
  return getCheckedNodes(treeData);
});

// 计算总叶子节点数
const countLeafNodes = (nodes) => {
  let count = 0;
  for (const node of nodes) {
    if (node.type) {
      count++;
    }
    if (node.children && node.children.length > 0) {
      count += countLeafNodes(node.children);
    }
  }
  return count;
};

const totalLeafCount = computed(() => countLeafNodes(treeData));

// 检查是否有未选中的节点
const hasUncheckedNodes = computed(() => {
  const checkUnchecked = (nodes) => {
    for (const node of nodes) {
      if (node.type && !node.checked) return true;
      if (node.children && checkUnchecked(node.children)) return true;
    }
    return false;
  };
  return checkUnchecked(treeData);
});

// 检查是否有可移除的节点
const hasRemovableNodes = computed(() => {
  return checkedNodes.value.some(node => !lockedIdList.value.includes(node.id));
});

// 添加所有可见的未选中节点
const addAllVisible = () => {
  const addNodes = (nodes) => {
    for (const node of nodes) {
      if (node.type && !node.checked && node.visible !== false) {
        node.checked = true;
      }
      if (node.children) {
        addNodes(node.children);
      }
    }
  };
  addNodes(treeData);
};

// 移除所有未锁定的节点
const removeAllUnlocked = () => {
  const removeNodes = (nodes) => {
    for (const node of nodes) {
      if (node.type && node.checked && !lockedIdList.value.includes(node.id)) {
        node.checked = false;
      }
      if (node.children) {
        removeNodes(node.children);
      }
    }
  };
  removeNodes(treeData);
};

// 恢复默认：只保留锁定的节点
const resetToDefault = () => {
  const resetNodes = (nodes) => {
    for (const node of nodes) {
      if (node.type) {
        // 只有锁定的节点保持选中，其他全部取消
        node.checked = lockedIdList.value.includes(node.id);
      }
      if (node.children) {
        resetNodes(node.children);
      }
    }
  };
  resetNodes(treeData);
};

const removeTag = (node) => {
  if (lockedIdList.value.includes(node.id)) {
    return;
  }
  node.checked = false;
};
</script>

<style lang="scss" scoped>
#app-wrapper {
  padding: 40px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 10px 0;
    font-size: 24px;
    color: #303133;
  }

  p {
    margin: 0 0 20px 0;
    color: #606266;
  }
}

.selected-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .preview-label {
    color: #606266;
    font-size: 14px;
  }

  .preview-tag {
    margin: 0;
  }
}

/* --- 锁定ID区域样式 --- */
.locked-ids-area {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.locked-ids-header {
  margin-bottom: 12px;
  
  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
}

.locked-ids-input {
  margin-bottom: 12px;
}

.locked-ids-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.locked-id-tag {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
}

/* --- 穿梭框弹框样式 --- */
:deep(.transfer-dialog) {
  .el-dialog__body {
    padding: 0;
  }
}

.transfer-container {
  display: flex;
  align-items: stretch;
  height: 450px;
}

.transfer-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
}

.transfer-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
}

.transfer-panel-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.transfer-panel-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.transfer-panel-count {
  font-size: 12px;
  color: #909399;
}

.transfer-panel-filter {
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
}

.transfer-panel-body {
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
    border-radius: 3px;
    
    &:hover {
      background-color: #909399;
    }
  }
  
  &::-webkit-scrollbar-track {
    background-color: #f5f7fa;
  }
}

.tree-wrapper {
  padding: 8px 0;
}

/* --- 中间按钮样式 --- */
.transfer-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
}

/* --- 右侧已选标签样式 --- */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 15px;
  align-content: flex-start;
}

.selected-tag {
  margin: 0;
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
  
  &:hover {
    background-color: #d9ecff;
  }
  
  :deep(.el-tag__close) {
    color: #409eff;
    
    &:hover {
      background-color: #409eff;
      color: #fff;
    }
  }
}

.transfer-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* --- 树形组件根样式 --- */
:deep(.tree-node-root) {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
