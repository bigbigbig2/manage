const util = require('./../utils/util')
const Leave = require('./../models/leaveSchema')
const Dept = require('./../models/deptSchema')
const router = require('koa-router')()
router.prefix('/leave')

//获取申请列表
router.get('/list', async (ctx) => {
    const { applyState,type} = ctx.request.query;
    const { page, skipIndex } = util.paper(ctx.request.query);
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization)
    try { 
        let params = {};
        //待我审批页面查询
        if (type == 'approve') {
            //待审批和审批中
            if (applyState == 1||applyState == 2) {
                params.curAuditUserName = data.userName;
                params.$or = [{ applyState: 1 }, { applyState: 2 }]
            } else if(applyState > 2) {
                params = { "auditFlows.userId": data.userId, applyState }
            //查询全部
            } else {
                params = {"auditFlows.userId":data.userId}
            }
        //休假申请页面查询（查到的是当前登录用户的休假申请情况）
        } else {
            params = { "applyUser.userId": data.userId }
            if (applyState) params.applyState = applyState;
        }
            
        
       
        const query = Leave.find(params)
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await Leave.countDocuments(params);
        ctx.body = util.sucess({ 
            page: {
                ...page,
                total
            },
            list
        })
    }catch(e) {
        ctx.body = util.fail(`查询失败：${e.stack}`)
    }
})

router.post('/operate', async (ctx) => {
    const { _id, action, ...params } = ctx.request.body;
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization) 
    if(action == 'create'){
        //组装申请单号
        let orderNo = "XJ";
        orderNo += util.formateDate(new Date(), "yyyyMMdd");
        let total =await Leave.countDocuments();
        params.orderNo = orderNo+total
        //获取当前用户的部门ID
        let id = data.deptId.pop();
        //根据部门ID查找负责人信息
        let dept = await Dept.findById(id)
        //获取人事部门和财务部门的负责人信息
        let userList = await Dept.find({ deptName: { $in: ['人事部门', '财务部门'] } })
        

        //组装完整审批人
        let auditUsers = dept.userName;

        //组装审批流
        let auditFlows = [ 
            {userId:dept.userId,userName:dept.userName,userEmail:dept.userEmail}
        ]
        userList.map(item => {
            auditFlows.push({
                userId:item.userId,userName:item.userName,userEmail:item.userEmail
            })
            auditUsers += ',' + item.userName;
        })
        params.auditUsers = auditUsers;
        params.curAuditUserName = dept.userName;
        params.auditFlows = auditFlows;
        params.auditLogs = []
        params.applyUser = {
            userId: data.userId,
            userName: data.userName,
            userEmail:data.userEmail
        }
        // params.applayType = params.applayType
        
        let res = await Leave.create(params);
        ctx.body = util.sucess('',"创建成功")
    } else {
        let res = await Leave.findByIdAndUpdate(_id, { applyState: 5 })
        ctx.body = util.sucess('',"操作成功")
    }

    

    


})
router.post('/approve', async (ctx) => {
    const { _id, action, remark } = ctx.request.body;
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization)
    let params = {}
    
    let doc =await Leave.findById(_id);
    let auditLogs = doc.auditLogs || [];
    if (action == "refuse") {
        //审核拒绝
        params.applyState = 3;
    } else {
        // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
        //审核通过
        if (doc.auditFlows.length == doc.auditLogs.length) {
            //因为每次审批通过一次都添加一条auditLogs所以下面情况为审批完成的情况
            ctx.body = util.sucess('当前申请单已处理，请勿重新提交')
            return;

        //当前为最后一级审批人情况
        } else if (doc.auditFlows.length == doc.auditLogs.length + 1) {
            params.applyState = 4;
        } else if(doc.auditFlows.length > doc.auditLogs.length) {
            //审批中
            params.applyState = 2;
            params.curAuditUserName = doc.auditFlows[doc.auditLogs.length + 1].userName
        } else {
            params.applyState = 4;
        }

    }
    auditLogs.push({
        userId: data.userId,
        userName: data.userName,
        createTime: new Date(),
        remark,
        action:action == 'refues'?"审核拒绝":"审核通过"
    })
    params.auditLogs = auditLogs;
    let res = await Leave.findByIdAndUpdate(_id, params);
    ctx.body= util.sucess('','处理成功')
})
router.get('/count',async (ctx) => {
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization);
    try {
        let params = {};
        params.curAuditUserName = data.userName;
        params.$or = [{ applyState: 1 },{applyState:2}]
        const total = await Leave.countDocuments(params)
        ctx.body = util.sucess(total)
    } catch (e) {
        ctx.body= util.fail(`查询异常:${e}`)
    }
})
module.exports = router;