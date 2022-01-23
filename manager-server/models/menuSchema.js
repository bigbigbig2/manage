const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    menuType:Number,
    menuName:String,
    menuCode:String,//权限标识
    path:String, //路由地址
    icon:String, //图标
    component:String, //组件地址
    menuState:Number, //菜单状态
    parentId:[mongoose.Types.ObjectId],//它父级的所有引用关系
    //创建时间
    "createTime":{
        type:Date,
        default:Date.now()
    },
    //更新时间
    "updateTime":{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model('menu',userSchema,"menus")