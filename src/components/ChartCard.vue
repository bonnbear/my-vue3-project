<template>
  <div class="chart-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <button v-if="editMode" @click="$emit('removeItem', id)" class="remove-btn">X</button>
    </div>
    <div class="chart-container">
      <!-- 这里应该是实际的图表组件 -->
      <div class="mock-chart">
        <p>Chart Type: {{ chartType }}</p>
        <p>Data: {{ JSON.stringify(data) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  title: String,
  chartType: String,
  data: Array,
  editMode: Boolean
});

defineEmits(['removeItem']);
</script>

<style scoped>
.chart-card {
  padding: 10px;
  height: 100%;
  overflow: auto;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0 0 10px 0;
}

.remove-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.chart-container {
  height: calc(100% - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.mock-chart {
  border: 1px dashed #999;
  padding: 10px;
  text-align: center;
}
</style>