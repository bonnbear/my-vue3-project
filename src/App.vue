<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>可拖曳排序的 Element Plus 表格</span>
      </div>
    </template>
    <el-table :data="tableData" row-key="id" style="width: 100%">
      <el-table-column label="拖曳" width="80" align="center">
        <template #default>
          <el-icon class="drag-handle" :size="20"><Rank /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="180">
        <template #default="{ row }">
          <el-input
            v-if="editingCell?.rowId === row.id && editingCell?.prop === 'name'"
            v-model="row.name"
            @blur="handleInputBlur"
            placeholder="請輸入姓名"
          ></el-input>
          <div v-else @click="handleCellClick(row, 'name')" class="cell-content">
            {{ row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-input
            v-if="editingCell?.rowId === row.id && editingCell?.prop === 'role'"
            v-model="row.role"
            @blur="handleInputBlur"
            placeholder="請輸入角色"
          ></el-input>
          <div v-else @click="handleCellClick(row, 'role')" class="cell-content">
            {{ row.role }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sortable from 'sortablejs';

// 表格資料
const tableData = ref([
  { id: 1, name: 'Alice', role: 'Developer' },
  { id: 2, name: 'Bob', role: 'Designer' },
  { id: 3, name: 'Charlie', role: 'Project Manager' },
  { id: 4, name: 'David', role: 'Tester' },
  { id: 5, name: 'Eve', role: 'DevOps Engineer' },
]);

// 追蹤正在編輯的儲存格，格式為 { rowId, prop }
const editingCell = ref(null);

// 進入編輯模式
const handleCellClick = (row, prop) => {
  editingCell.value = { rowId: row.id, prop };
};

// 退出編輯模式
const handleInputBlur = () => {
  editingCell.value = null;
};

// 初始化 Sortable
const initSortable = () => {
  // 獲取表格的 tbody 元素
  const el = document.querySelector('.el-table__body-wrapper tbody');
  if (!el) {
    console.error('Element-Plus table body not found.');
    return;
  }

  Sortable.create(el, {
    handle: '.drag-handle', // 指定拖曳操作的目標元素
    animation: 150, // 動畫效果
    onEnd: (evt) => {
      // 拖曳結束後的回呼
      const { oldIndex, newIndex } = evt;
      
      // 重新排列資料
      const movedItem = tableData.value.splice(oldIndex, 1)[0];
      tableData.value.splice(newIndex, 0, movedItem);
    },
  });
};

// 在組件掛載後執行
onMounted(() => {
  initSortable();
});
</script>

<style scoped>
.box-card {
  margin: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
.cell-content {
  min-height: 24px; /* 確保空白儲存格也可以點擊 */
  cursor: pointer;
}
</style>