//环境配置封装
const  env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    //开发环境
    dev:{
        baseApi:'/api',
        mockApi:'https://www.fastmock.site/mock/4c22c0ad9395bacbad44194547bc0155/api'
    },
    //测试环境
    test:{
        baseApi:'/api',
        mockApi:'https://www.fastmock.site/mock/4c22c0ad9395bacbad44194547bc0155/api'
    },
    //生产环境
    prod:{
        baseApi:'/api',
        mockApi:'https://www.fastmock.site/mock/4c22c0ad9395bacbad44194547bc0155/api' //生产环境通常不需要mockApis
    }
} 
export default {
    env,
    mock:false  ,
    namespace:'manager',
    ...EnvConfig[env]//baseApi,mockApi
}