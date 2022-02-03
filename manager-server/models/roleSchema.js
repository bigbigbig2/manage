const mongoose = require('mongoose');
const roleSchema = mongoose.Schema({
    roleName: String,
    remark: String, //备注
    updateTime: {
        type: Date,
        default:Date.now()
    },
    permissionList: {
        checkedKeys: [],
        halfCheckedKeys:[]
    },
    createTime: {
        type: Date,
        default:Date.now()
    }
})
module.exports = mongoose.model("roles",roleSchema,"roles")
