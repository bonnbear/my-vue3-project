<template>
  <div class="container-wrapper">
    <div class="fixed-size-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FixedSize16To9Container'
})
</script>

<style scoped>
.container-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.fixed-size-container {
  width: 800px; /* 可以根据需要调整 */
  height: 450px; /* 保持 16:9 的比例 */
  background-color: #42b983;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 820px) {
  .fixed-size-container {
    width: 90vw;
    height: calc(90vw * 9 / 16);
  }
}
</style>