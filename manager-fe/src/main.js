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

app.directive('has', {
    beforeMount(el, binding) {
        console.log(el, binding)
        //获取按钮权限
        let actionList = storage.getItem("actionList")
        let value = binding.value
        let hasPermission = actionList.includes(value)
        if (!hasPermission) {
            el.style = "display:none"; //先隐藏
            setTimeout(() => {
                el.parentNode.removeChild(el); //在把这个节点给删除掉(要让它变成一个宏任务，因为直接弄的话弄的是VDOM)
            },0)
        }
    }
})
//全局注册某个变量
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.use(router).use(ElementPlus).use(store).mount('#app')

