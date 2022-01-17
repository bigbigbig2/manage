import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'
console.log("环境变量=>", import.meta.env);
const app= createApp(App)
// axios.get(config.mockApi + '/login').then((res)=>{
//     console.log(res)
// })

//全局注册某个变量
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.use(router).use(ElementPlus).use(store).mount('#app')

