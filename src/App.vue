<template>
  <div id="app-wrapper">
    <div class="card-container" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
      <div class="sidebar-container">
        <div class="sidebar-header">文件浏览器</div>
        <!-- Search Input -->
        <div class="sidebar-search" v-if="isSidebarOpen">
          <el-input
            v-model="filterText"
            placeholder="搜索..."
            clearable
            size="small"
          >
            <template #prefix>
              <Search style="width: 1em; height: 1em; margin-right: 8px;" />
            </template>
          </el-input>
        </div>
        <div class="sidebar-content">
          <div class="tree-wrapper">
            <ul class="tree-node-root">
              <TreeNode
                v-for="(node, index) in treeData"
                v-show="node.visible !== false"
                :key="node.name"
                :node="node"
                :selected-id="selectedNodeId"
                :level="0"
                @node-click="handleNodeClick"
                :is-last="index === treeData.length - 1"
              />
            </ul>
          </div>
        </div>
      </div>

      <button @click="toggleSidebar" class="sidebar-toggle">
        {{ isSidebarOpen ? '‹' : '›' }}
      </button>

      <div class="main-content">
        <div class="main-header">
          <h1>主内容区域</h1>
        </div>
        <div class="main-body">
          <p>当左侧侧边栏收起时，这里的内容会平滑地占据更多空间。</p>
          
          <div v-if="selectedNodePath.length > 0" class="selected-info">
            <p>
              当前选中的节点是: <strong>{{ selectedNodeId }}</strong>
            </p>
            <p style="margin-top: 8px;">
              完整路径: 
              <span class="path-display">{{ selectedNodePath.map(p => p.name).join(' / ') }}</span>
            </p>
          </div>

          <!-- 穿梭框/已选标签区域 -->
          <div class="transfer-box-area">
            <div class="transfer-header">
              <h3>已选标签 ({{ checkedNodes.length }})</h3>
              <el-button type="primary" link @click="clearAllTags" v-if="checkedNodes.length > 0">清空</el-button>
            </div>
            <div class="tags-container" v-if="checkedNodes.length > 0">
              <el-tag
                v-for="node in checkedNodes"
                :key="node.name"
                closable
                @close="removeTag(node)"
                class="selected-tag"
              >
                {{ node.name }}
              </el-tag>
            </div>
            <div v-else class="empty-tags">
              请在左侧目录树中勾选项目
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import TreeNode from './TreeNode.vue';

const isSidebarOpen = ref(true);
const filterText = ref('');

const treeData = reactive([
  { name: '项目根目录', isOpen: true, checked: false, children: [
      { name: 'src', isOpen: true, checked: false, children: [
          { name: 'App.vue', checked: false },
          { name: 'main.js', checked: false },
          { name: 'components', checked: false, children: [ { name: 'Button.vue', checked: false }, { name: 'Modal.vue', checked: false }, { name: 'Card.vue', checked: false } ] },
          { name: 'views', checked: false, children: [ { name: 'Home.vue', checked: false }, { name: 'About.vue', checked: false } ] }
      ]},
      { name: 'public', checked: false, children: [ { name: 'index.html', checked: false }, { name: 'favicon.ico', checked: false } ]},
      { name: 'package.json', checked: false },
      { name: 'README.md', checked: false },
      { name: 'vite.config.js', checked: false }
  ]},
  { name: '文档', checked: false, children: [ { name: 'guide.md', checked: false }, { name: 'api.md', checked: false } ] }
]);

const selectedNodeId = ref(null);
const selectedNodePath = ref([]);

const handleNodeClick = (path) => {
  const clickedNode = path[path.length - 1];
  selectedNodeId.value = clickedNode.name;
  selectedNodePath.value = path;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// --- Search Logic ---
watch(filterText, (val) => {
  filterTree(treeData, val);
});

const filterTree = (nodes, query) => {
  let hasVisible = false;
  for (const node of nodes) {
    // If query is empty, show all
    if (!query) {
      node.visible = true;
      if (node.children) {
        filterTree(node.children, query);
      }
      continue;
    }

    // Check children first
    let childVisible = false;
    if (node.children) {
      childVisible = filterTree(node.children, query);
    }

    // Check self
    const selfVisible = node.name.toLowerCase().includes(query.toLowerCase());

    // Determine visibility
    node.visible = selfVisible || childVisible;

    // Auto expand if children match
    if (childVisible) {
      node.isOpen = true;
    }
    
    if (node.visible) hasVisible = true;
  }
  return hasVisible;
};

// --- Checkbox Logic ---

// 递归获取所有被勾选的节点
const getCheckedNodes = (nodes) => {
  let checked = [];
  for (const node of nodes) {
    if (node.checked) {
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

const removeTag = (node) => {
  node.checked = false;
};

const clearAllTags = () => {
  const clearNodes = (nodes) => {
    nodes.forEach(node => {
      node.checked = false;
      if (node.children) {
        clearNodes(node.children);
      }
    });
  };
  clearNodes(treeData);
};
</script>

<style lang="scss" scoped>
/* [重构] App.vue 现在只包含与自身布局和树的根容器相关的样式 */
.path-display {
  color: #586069;
  background-color: #eef0f2;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; background-color: #f4f7f9; overflow-x: hidden; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
#app-wrapper { padding: 20px; width: 100%; max-width: 1400px; }
.card-container { display: flex; height: calc(100vh - 40px); min-height: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); overflow: hidden; position: relative;
  .sidebar-container { width: 320px; flex-shrink: 0; background-color: #fafbfc; border-right: 1px solid #e1e4e8; transition: width 0.3s ease-in-out; overflow: hidden; display: flex; flex-direction: column;
    .sidebar-header { padding: 20px 24px; font-weight: 600; font-size: 16px; border-bottom: 1px solid #e1e4e8; background-color: #fff; color: #24292e; flex-shrink: 0; white-space: nowrap; }
    .sidebar-search { padding: 10px 24px; border-bottom: 1px solid #e1e4e8; background-color: #fff; flex-shrink: 0; }
    .sidebar-content { flex-grow: 1; overflow-y: auto; overflow-x: hidden; background-color: #fafbfc;
      &::-webkit-scrollbar { width: 6px; } &::-webkit-scrollbar-track { background: transparent; } &::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; &:hover { background: #b0b7c3; } }
    }
  }
  .sidebar-toggle { position: absolute; top: 20px; left: 320px; transform: translateX(-50%); width: 28px; height: 28px; background-color: #fff; color: #586069; border: 1px solid #e1e4e8; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; line-height: 1; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); z-index: 10; transition: left 0.3s ease-in-out, background-color 0.2s, transform 0.2s;
    &:hover { background-color: #f6f8fa; transform: translateX(-50%) scale(1.05); }
    &:active { transform: translateX(-50%) scale(0.95); }
  }
  .main-content { flex-grow: 1; display: flex; flex-direction: column; background-color: #fff; transition: margin-left 0.3s ease-in-out;
    .main-header { padding: 20px 30px; background-color: #fff; border-bottom: 1px solid #e1e4e8; flex-shrink: 0;
      h1 { margin: 0; font-size: 24px; font-weight: 600; color: #24292e; }
    }
    .main-body { padding: 30px; flex-grow: 1; overflow-y: auto;
      .selected-info { margin-top: 20px; padding: 16px; background-color: #f6f8fa; border-radius: 6px; border-left: 4px solid #0969da;
        p { margin: 0; color: #586069;
          strong { color: #24292e; font-weight: 600; }
        }
      }
    }
  }
  &.sidebar-collapsed {
    .sidebar-container { width: 0; border-right-color: transparent; }
    .sidebar-toggle { left: 20px; }
  }
}

/* --- 树形组件外部容器样式 --- */
.tree-wrapper {
  padding: 8px 0;
}

/* --- 穿梭框区域样式 --- */
.transfer-box-area {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.transfer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eaecef;
  
  h3 {
    margin: 0;
    font-size: 16px;
    color: #24292e;
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  background-color: #e3f2fd;
  border-color: #bbdefb;
  color: #0969da;
}

.empty-tags {
  color: #6e7781;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

/*
  因为 .tree-node-root 是在 App.vue 的模板中渲染的 <ul>,
  所以它的样式规则需要保留在这里。
  使用 :deep() 是为了确保它能应用到 TreeNode 组件的根元素上。
*/
:deep(.tree-node-root) {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>