import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import VueGridLayout from 'vue-grid-layout'  ;
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(VueGridLayout)
app.use(router); // ✅ 挂载 vue-router
app.mount('#app')