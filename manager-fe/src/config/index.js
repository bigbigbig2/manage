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
        mockApi:'' //生产环境通常不需要mockApis
    }
} 
export default {
    env,
    mock:false  , //设为false便可以联调后端接口了,就不是请求mock接口了
    //baseApi:'www.baudu.com/api' 变为动态的了baseApi了调用上面的
    namespace:'manager',
    ...EnvConfig[env]
}