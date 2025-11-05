<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">跨树拖放组件</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 树形结构 1 -->
      <div 
        class="border-2 border-gray-300 rounded-lg p-4 min-h-96 bg-white"
        @dragover.prevent
        @drop="handleDropOnTree($event, 'tree1')"
      >
        <h2 class="text-lg font-semibold mb-3 text-gray-700">树形结构 1</h2>
        <div class="space-y-1">
          <TreeNode
            v-for="node in tree1"
            :key="node.id"
            :node="node"
            :tree-id="'tree1'"
            :level="0"
            @toggle="handleToggle"
            @drag-start="handleDragStart"
            @drag-over="handleDragOver"
            @drop="handleDrop"
            @drag-end="handleDragEnd"
          />
        </div>
        <div v-if="tree1.length === 0" class="text-gray-400 text-center py-8">
          拖放节点到这里
        </div>
      </div>

      <!-- 树形结构 2 -->
      <div 
        class="border-2 border-gray-300 rounded-lg p-4 min-h-96 bg-white"
        @dragover.prevent
        @drop="handleDropOnTree($event, 'tree2')"
      >
        <h2 class="text-lg font-semibold mb-3 text-gray-700">树形结构 2</h2>
        <div class="space-y-1">
          <TreeNode
            v-for="node in tree2"
            :key="node.id"
            :node="node"
            :tree-id="'tree2'"
            :level="0"
            @toggle="handleToggle"
            @drag-start="handleDragStart"
            @drag-over="handleDragOver"
            @drop="handleDrop"
            @drag-end="handleDragEnd"
          />
        </div>
        <div v-if="tree2.length === 0" class="text-gray-400 text-center py-8">
          拖放节点到这里
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">使用说明：</h3>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• 拖动任意节点到另一棵树的任意节点上，将其作为子节点</li>
        <li>• 拖动节点到空白区域，将其添加到根级别</li>
        <li>• 支持跨树和跨层级拖放</li>
        <li>• 点击文件夹图标前的箭头可以展开/折叠节点</li>
        <li>• 拖放时目标节点会高亮显示</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TreeNode from './TreeNode.vue';

// 初始数据
const tree1 = ref([
  {
    id: '1',
    name: '文件夹 1',
    expanded: true,
    children: [
      {
        id: '1-1',
        name: '子文件夹 1-1',
        expanded: true,
        children: [
          { id: '1-1-1', name: '文件 1-1-1', children: [] },
          { id: '1-1-2', name: '文件 1-1-2', children: [] }
        ]
      },
      {
        id: '1-2',
        name: '子文件夹 1-2',
        expanded: false,
        children: [
          { id: '1-2-1', name: '文件 1-2-1', children: [] }
        ]
      },
      { id: '1-3', name: '文件 1-3', children: [] }
    ]
  },
  {
    id: '2',
    name: '文件夹 2',
    expanded: true,
    children: [
      { id: '2-1', name: '文件 2-1', children: [] },
      { id: '2-2', name: '文件 2-2', children: [] }
    ]
  }
]);

const tree2 = ref([
  {
    id: '3',
    name: '项目 A',
    expanded: true,
    children: [
      {
        id: '3-1',
        name: '模块 A-1',
        expanded: true,
        children: [
          { id: '3-1-1', name: '组件 A-1-1', children: [] }
        ]
      },
      { id: '3-2', name: '组件 A-2', children: [] }
    ]
  },
  {
    id: '4',
    name: '项目 B',
    expanded: false,
    children: [
      { id: '4-1', name: '模块 B-1', children: [] }
    ]
  }
]);

const draggedNode = ref(null);

// 辅助函数
const findNode = (tree, nodeId) => {
  for (let node of tree) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNode(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
};

const removeNode = (tree, nodeId) => {
  return tree.filter(node => {
    if (node.id === nodeId) return false;
    if (node.children) {
      node.children = removeNode(node.children, nodeId);
    }
    return true;
  });
};

const addNodeToTarget = (tree, targetId, nodeToAdd) => {
  return tree.map(node => {
    if (node.id === targetId) {
      return {
        ...node,
        children: [...(node.children || []), nodeToAdd],
        expanded: true
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNodeToTarget(node.children, targetId, nodeToAdd)
      };
    }
    return node;
  });
};

// 事件处理函数
const handleToggle = (payload) => {
  const { nodeId, treeId } = payload;
  
  const updateTree = (tree) => {
    return tree.map(node => {
      if (node.id === nodeId) {
        return { ...node, expanded: !node.expanded };
      }
      if (node.children) {
        return { ...node, children: updateTree(node.children) };
      }
      return node;
    });
  };

  if (treeId === 'tree1') {
    tree1.value = updateTree(tree1.value);
  } else {
    tree2.value = updateTree(tree2.value);
  }
};

const handleDragStart = (payload) => {
  const { nodeId, treeId } = payload;
  const sourceTree = treeId === 'tree1' ? tree1.value : tree2.value;
  const node = findNode(sourceTree, nodeId);
  draggedNode.value = { ...node, sourceTreeId: treeId };
};

const handleDragOver = (payload) => {
  // 可以在这里添加更多的拖放逻辑
};

const handleDrop = (payload) => {
  const { sourceNodeId, sourceTreeId, targetNodeId, targetTreeId } = payload;
  
  if (sourceNodeId === targetNodeId) return;

  const sourceTree = sourceTreeId === 'tree1' ? tree1.value : tree2.value;
  
  // 获取源节点
  const nodeToMove = findNode(sourceTree, sourceNodeId);
  if (!nodeToMove) return;

  // 检查目标节点是否是源节点的子节点（避免循环引用）
  const isChildOfSource = (node, parentId) => {
    if (node.id === parentId) return true;
    if (node.children) {
      for (let child of node.children) {
        if (isChildOfSource(child, parentId)) return true;
      }
    }
    return false;
  };

  if (isChildOfSource(nodeToMove, targetNodeId)) {
    alert('不能将节点拖放到其自身的子节点中');
    return;
  }

  // 从源树中移除节点
  if (sourceTreeId === 'tree1') {
    tree1.value = removeNode(tree1.value, sourceNodeId);
  } else {
    tree2.value = removeNode(tree2.value, sourceNodeId);
  }

  // 将节点添加到目标树
  const nodeCopy = JSON.parse(JSON.stringify(nodeToMove));
  if (targetTreeId === 'tree1') {
    tree1.value = addNodeToTarget(tree1.value, targetNodeId, nodeCopy);
  } else {
    tree2.value = addNodeToTarget(tree2.value, targetNodeId, nodeCopy);
  }
};

const handleDragEnd = () => {
  draggedNode.value = null;
};

const handleDropOnTree = (e, treeId) => {
  e.preventDefault();
  if (!draggedNode.value) return;

  const sourceNodeId = draggedNode.value.id;
  const sourceTreeId = draggedNode.value.sourceTreeId;

  if (sourceTreeId === treeId) return;

  // 从源树中移除节点
  if (sourceTreeId === 'tree1') {
    tree1.value = removeNode(tree1.value, sourceNodeId);
  } else {
    tree2.value = removeNode(tree2.value, sourceNodeId);
  }

  // 将节点添加到目标树的根级别
  const nodeCopy = JSON.parse(JSON.stringify(draggedNode.value));
  delete nodeCopy.sourceTreeId;
  
  if (treeId === 'tree1') {
    tree1.value = [...tree1.value, nodeCopy];
  } else {
    tree2.value = [...tree2.value, nodeCopy];
  }
};
</script>

<style scoped>
.min-h-96 {
  min-height: 24rem;
}
</style>