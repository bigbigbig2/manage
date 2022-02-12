const mongoose = require('mongoose')
const deptSchema = mongoose.Schema({
    deptName: String,
    userName: String,
    userId: String,
    userEmail: String,
    parentId: [mongoose.Types.ObjectId],
    createTime: {
        type: Date,
        default: new Date
    },
    updateTime: {
        type: Date,
        default: new Date
    }
})
module.exports = mongoose.model('depts',deptSchema,'depts')