const mongoose = require('mongoose')
//用户表结构（各个字段及类型）
const leaveSchema = mongoose.Schema({
    orderNo: String,
    applayType: Number,
    startTime: {type:Date, default: Date.now },
    endTime:{type:Date,default: Date.now},
    applyUser: {
        userId: String,
        userName: String,
        userEmail: String
    },
    leaveTime: String,
    reasons: String,
    auditUsers: String,
    curAuditUserName: String,
    auditFlows: [
        {
            userId: String,
            userName: String,
            userEmail: String
        }
    ],
    auditLogs: [
        {
            userId: String,
            userName: String,
            createTime: Date,
            remark: String,
            action: String
        }
    ],
    applyState: { type: Number, default: 1 },
    createTime:{type:Date, default: Date.now }

})
module.exports = mongoose.model("leaves",leaveSchema,"leaves")