/*
通用工具函数封装
*/
const log4js = require('./log4j')
const CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, //参数错误
    USER_ACCOUNT_ERROR:20001,//用户账号或密码错误
    USER_LOGIN_ERROR:30001,//用户未登录
    BUSINESS_ERROR: 40001,//业务请求失败
    AUTH_ERROR: 50001,//认证失败或TOKEN过期
}
module.exports = {
    /*
    分页结构封装
    @param {number} pageNum
    @param {number} pageSize
    */
    pager({pageNum=1,pageSize=10}){//先给个默认的参数值
        pageNum*=1;
        pageSize*=1;
        const skipIndex = (pageNum-1)*pageSize;//第n页的起始页
        return{
            page:{
                pageNum,
                pageSize
            },
            skipIndex
        }
    },
    sucess(data='',msg='',code =CODE.SUCCESS ){
        log4js.debug(data)
        return{
            code,data,msg
        }
    },
    fail(msg='',code=CODE.BUSINESS_ERROR,data=''){
        log4js.debug(msg)
        return {
            msg,code,data
        }
    },
    CODE


}