
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import './assets/style/global.css'
import {useDark, useToggle} from '@vueuse/core'
//import * as Icons from '@element-plus/icons-vue'
// 使用Element PLUS完成美工
//Object.keys(Icons).forEach(key => {app.component(key, Icons[key])})
const app = createApp(App)
useToggle(useDark())
app.use(ElementPlus,{size:'small', zIndex:3000})
app.mount('#app')
