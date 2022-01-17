//axios二次封装
import axios from "axios";
import config from "./../config";
import {ElMessage } from "element-plus" //导入一个报错提示组件
import router from './../router'
import storage from './storage'

const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

//创建axios实例对象，添加全局配置
const service = axios.create({
    baseURL:config.baseApi,
    timeout:8000
})

//请求拦截(拦截下来给它添加token)
service.interceptors.request.use((req)=>{
    const headers = req.headers;
    const {token} = storage.getItem('userInfo');
    if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;
    return req;
})

//响应拦截
service.interceptors.response.use((res)=>{
    const {code, data, msg} = res.data; 
    if (code === 200){
        return data;
    }else if (code === 50001){
        ElMessage.error(TOKEN_INVALID)
        setTimeout(()=>{
            router.push('/login')
        },15000)
        return Promise.reject(TOKEN_INVALID) //这将显示在控制台里
    }else{
        ElMessage.error(msg || NETWORK_ERROR)
    }
})
//封装函数本身（重点）
//请求核心函数
//其实和axios使用差不多
function request(options){
    options.method = options.method || 'get'
    //将get的请求参数params改为和post请求参数相同的data，这样在项目中就不用过度的去区分get请求还是post请求
    if (options.method.toLowerCase() === 'get'){
        options.params = options.data
    }
    let isMock = config.mock;
    if (typeof options.mock != 'undefined') {
        isMock = options.mock;
    }
    //mock数据相关
    if(config.env == 'prod'){
        service.defaults.baseURL = config.baseApi //确保万无一失
    }else{
        service.defaults.baseURL = isMock ? config.mockApi:config.baseApi
    }
    return service(options)
}
//将一些静态属性添加到request函数上
// ['get','post','put','delete','patch'].forEach((item)=>{
//     request[item] = (url,data,options) => {
//         return request({
//             url,
//             data,
//             method:item,
//             ...options
//         })
//     }
// })
export default request;