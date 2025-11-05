// 子组件 (ChildComponent.vue)
<template>
  <div>
    <h3>Child Component</h3>
    <p>Count: {{ count }}</p>
    <p>Message: {{ message }}</p>
    <button @click="callParentMethod">Call Parent Method</button>
    <button @click="localUpdateMessage">Update Message Locally</button>
  </div>
</template>

<script>
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'

export default {
  props: ['parentMethod'],
  setup(props) {
    const count = ref(0)
    const state = reactive({
      message: 'Hello from child'
    })

    const instance = getCurrentInstance()

    const incrementCount = () => {
      count.value++
    }

    const updateMessage = (newMessage) => {
      state.message = newMessage
    }

    const localUpdateMessage = () => {
      updateMessage('Updated locally')
    }

    const callParentMethod = () => {
      if (instance && instance.proxy) {
        props.parentMethod(instance.proxy)
      } else {
        console.error('Component instance not available')
      }
    }

    return {
      count,
      ...toRefs(state),  // 使用 toRefs 来保持响应性
      incrementCount,
      updateMessage,
      callParentMethod,
      localUpdateMessage
    }
  }
}
</script>