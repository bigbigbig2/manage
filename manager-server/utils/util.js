/*
通用工具函数封装
*/
const log4js = require('./log4j')
const jwt = require('jsonwebtoken')
//错误吗
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
    @param {number} pageNum:第几页
    @param {number} pageSize:每页条数
    */
    paper({pageNum=1,pageSize=10}){//先给个默认的参数值
        pageNum*=1;
        pageSize*=1;
        const skipIndex = (pageNum-1)*pageSize;//根据当前是第几页返回要区的数据，第n条数据的的起始索引
        return{ //返回一个新的page对象(根据你给出的当前是第几页计算去查数据库并返回来）
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
    CODE,
    decoded(authorization) {
        if (authorization) {
            let token = authorization.split(' ')[1]
            return jwt.verify(token,'mytoken')
        }
        return '';
    },
    getTreeMenu(rootList, id, list) {
        //遍历一级菜单（使用判断，如果它的parentId为Null则它为一级菜单，然后添加到list中
        for (let i = 0; i < rootList.length; i++) {
            let item = rootList[i]
            if (String(item.parentId.slice().pop()) == String(id)) {
                console.log('item=>',item)
                list.push(item._doc)
            }
        }
        //在递归遍历下一层数组
        list.map(item => {
            item.children = []
            this.getTreeMenu(rootList, item._id, item.children)
            if (item.children.length == 0) {
                delete item.children;
            } else if (item.children.length > 0 && item.children[0].menuType == 2) {
                // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
                item.action = item.children;
            }
        })
        return list;
    },
    //日期时间格式化
    formateDate(date, rule) {
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
        }
        const o = {
            // 'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                const val = o[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
            }
        }
        return fmt;
    }


}