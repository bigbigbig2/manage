const mongoose = require('mongoose')
//用户表结构（各个字段及类型）
const userSchema = mongoose.Schema({
    "userId" : Number,//用户ID，自增长（注意mysql里的主键是可以自动增长的，而mongo不能）
    "userName" : String,//用户名称
    "userPwd" : String,//用户密码，md5加密
    "userEmail" : String,//用户邮箱  
    "mobile":String,//手机号
    "sex":Number,//性别 0:男  1：女 
    "deptId":[],//部门
    "job":String,//岗位
    "state" : {
        type:Number,
        default:1 //默认值为1
    },// 1: 在职 2: 离职 3: 试用期
    "role": {
        type:Number,
        default:1
    }, // 用户角色 0：系统管理员  1： 普通用户
    "roleList" : [], //系统角色
    "createTime" : {
        type:Date,
        default:Date.now()
    },//创建时间
    "lastLoginTime" : {
        type:Date,
        default:Date.now()
    },//更新时间
    remark:String //用户表的一些说明，拓张
})
//定义模型（，，模型的集合（表）
module.exports = mongoose.model("users",userSchema,"users")