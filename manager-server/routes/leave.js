const util = require('./../utils/util')
const Leave = require('./../models/leaveSchema')
const Dept = require('./../models/deptSchema')
const router = require('koa-router')()
router.prefix('/leave')

//获取申请列表
router.get('/list', async (ctx) => {
    const { applyState } = ctx.request.query;
    const { page, skipIndex } = util.paper(ctx.request.query);
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization)
    // console.log("tttttttttttttttttttt",data.userId)
    // try {
    let params = {
        "applyUser.userId":data.userId
    }
    if (applyState) params.applyState = applyState;
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
    // }catch(e) {
    //     ctx.body = util.fail(`查询失败：${e.stack}`)
    // }
})

router.post('/operate', async (ctx) => {
    const { _id, action,...params } = ctx.request.body;
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
            userName: data.userEmail,
            userEmail:data.userEmail
        }
        // params.applyState = 1
        // console.log("parmas", params);
        // console.log("dept", dept);
        let res = await Leave.create(params);
        ctx.body = util.sucess('',"创建成功")
    } else {
        let res = await Leave.findByIdAndUpdate(_id, { applyState: 5 })
        ctx.body = util.sucess('',"操作成功")
    }

    

    


})
module.exports = router;