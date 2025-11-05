<template>
  <div class="container">
    <div class="header">
      <h2 class="title">树形组件拖拽示例</h2>
      <p class="subtitle">支持节点在两棵树之间拖拽，可以跨层级移动</p>
    </div>

    <div class="tree-grid">
      <div class="tree-wrapper">
        <div class="tree-header">
          <h3 class="tree-title">树形结构 1</h3>
        </div>
        <div class="tree-content">
          <TreeNode
            v-for="node in treeData1"
            :key="node.key"
            :node="node"
            :expanded-keys="expandedKeys1"
            :drag-over-node="dragOverNode"
            :drag-over-position="dragOverPosition"
            @toggle="handleToggle1"
            @node-drag-start="(node) => handleDragStart(node, 'tree1')"
            @node-drag-over="handleDragOver"
            @node-drop="(payload) => handleDrop(payload.node, payload.position, 'tree1')"
            @node-drag-end="handleDragEnd"
          />
        </div>
      </div>

      <div class="tree-wrapper">
        <div class="tree-header">
          <h3 class="tree-title">树形结构 2</h3>
        </div>
        <div class="tree-content">
           <TreeNode
            v-for="node in treeData2"
            :key="node.key"
            :node="node"
            :expanded-keys="expandedKeys2"
            :drag-over-node="dragOverNode"
            :drag-over-position="dragOverPosition"
            @toggle="handleToggle2"
            @node-drag-start="(node) => handleDragStart(node, 'tree2')"
            @node-drag-over="handleDragOver"
            @node-drop="(payload) => handleDrop(payload.node, payload.position, 'tree2')"
            @node-drag-end="handleDragEnd"
          />
        </div>
      </div>
    </div>
    
    <div class="instructions">
      <h3 class="instructions-title">使用说明：</h3>
      <ul class="instructions-list">
        <li>• 点击箭头图标展开/折叠节点</li>
        <li>• 拖拽节点可以在两棵树之间移动</li>
        <li>• 拖到节点上方会插入为兄弟节点（上方）</li>
        <li>• 拖到节点中间会插入为子节点</li>
        <li>• 拖到节点下方会插入为兄弟节点（下方）</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TreeNode from './TreeNode.vue';

const treeData1 = ref([
    { key: '1', label: '一级 1', children: [
        { key: '1-1', label: '二级 1-1', children: [
            { key: '1-1-1', label: '三级 1-1-1' },
            { key: '1-1-2', label: '三级 1-1-2' }
        ]},
        { key: '1-2', label: '二级 1-2', children: [{ key: '1-2-1', label: '三级 1-2-1' }] }
    ]},
    { key: '2', label: '一级 2', children: [
        { key: '2-1', label: '二级 2-1' },
        { key: '2-2', label: '二级 2-2' }
    ]}
]);

const treeData2 = ref([
    { key: '3', label: '一级 3', children: [
        { key: '3-1', label: '二级 3-1', children: [{ key: '3-1-1', label: '三级 3-1-1' }] }
    ]},
    { key: '4', label: '一级 4', children: [{ key: '4-1', label: '二级 4-1' }] }
]);

const expandedKeys1 = ref(['1', '1-1', '2']);
const expandedKeys2 = ref(['3', '3-1', '4']);

const draggedNode = ref(null);
const draggedFromTree = ref(null);
const dragOverNode = ref(null);
const dragOverPosition = ref(null);

const handleToggle = (keys, key) => {
  const index = keys.value.indexOf(key);
  if (index > -1) {
    keys.value.splice(index, 1);
  } else {
    keys.value.push(key);
  }
};
const handleToggle1 = (key) => handleToggle(expandedKeys1, key);
const handleToggle2 = (key) => handleToggle(expandedKeys2, key);

const handleDragStart = (node, treeId) => {
  draggedNode.value = node;
  draggedFromTree.value = treeId;
};

const handleDragOver = ({ node, position }) => {
  dragOverNode.value = node.key;
  dragOverPosition.value = position;
};

const handleDragEnd = () => {
  dragOverNode.value = null;
  dragOverPosition.value = null;
};

const removeNodeFromTree = (tree, nodeKey) => {
  const newTree = [];
  for (const node of tree) {
    if (node.key === nodeKey) {
      continue;
    }
    if (node.children) {
      node.children = removeNodeFromTree(node.children, nodeKey);
    }
    newTree.push(node);
  }
  return newTree;
};

const insertNodeIntoTree = (tree, targetKey, node, position) => {
  const newTree = JSON.parse(JSON.stringify(tree));
  
  const insertRecursive = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === targetKey) {
        if (position === 'center') {
          nodes[i].children = nodes[i].children || [];
          nodes[i].children.push(node);
        } else if (position === 'top') {
          nodes.splice(i, 0, node);
        } else if (position === 'bottom') {
          nodes.splice(i + 1, 0, node);
        }
        return true;
      }
      if (nodes[i].children && insertRecursive(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };
  
  insertRecursive(newTree);
  return newTree;
};


const handleDrop = (targetNode, position, targetTreeId) => {
  if (!draggedNode.value) return;

  const sourceTreeId = draggedFromTree.value;
  let sourceData = sourceTreeId === 'tree1' ? treeData1.value : treeData2.value;
  let targetData = targetTreeId === 'tree1' ? treeData1.value : treeData2.value;
  
  const nodeCopy = JSON.parse(JSON.stringify(draggedNode.value));
  
  // 1. Remove from source
  const newSourceData = removeNodeFromTree(sourceData, draggedNode.value.key);

  // 2. Add to target
  let newTargetData;
  if (sourceTreeId === targetTreeId) {
    // If dragging within the same tree, the source data has already been modified
    newTargetData = insertNodeIntoTree(newSourceData, targetNode.key, nodeCopy, position);
  } else {
    // If dragging to a different tree, use the original target data
    newTargetData = insertNodeIntoTree(targetData, targetNode.key, nodeCopy, position);
  }

  // 3. Update state
  if (sourceTreeId === 'tree1') {
      if (targetTreeId === 'tree1') {
          treeData1.value = newTargetData;
      } else {
          treeData1.value = newSourceData;
          treeData2.value = newTargetData;
      }
  } else { // sourceTreeId === 'tree2'
      if (targetTreeId === 'tree2') {
          treeData2.value = newTargetData;
      } else {
          treeData2.value = newSourceData;
          treeData1.value = newTargetData;
      }
  }

  // 4. Reset drag state
  draggedNode.value = null;
  draggedFromTree.value = null;
  handleDragEnd();
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px;
}
.header {
  margin-bottom: 16px;
}
.title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: #4b5563;
}
.tree-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .tree-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.tree-wrapper {
  width: 100%;
  height: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
}
.tree-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
.tree-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}
.tree-content {
  padding: 8px;
  overflow: auto;
  max-height: 500px;
}
.instructions {
  margin-top: 24px;
  padding: 16px;
  background-color: #eff6ff;
  border-radius: 8px;
}
.instructions-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e40af;
  margin-bottom: 8px;
}
.instructions-list {
  font-size: 14px;
  color: #1d4ed8;
  list-style-type: none;
  padding: 0;
  space-y: 4px;
}
.instructions-list li {
    margin-bottom: 4px;
}
</style>