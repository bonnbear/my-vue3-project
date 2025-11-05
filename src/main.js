import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import VueGridLayout from 'vue-grid-layout'  ;
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(VueGridLayout)
app.mount('#app')