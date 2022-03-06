const util = require('./../utils/util')
const Leave = require('./../models/leaveSchema')
const router = require('koa-router')()
router.prefix('/leave')

router.get('/list', async (ctx) => {
    
    const { applyState } = ctx.request.query;
    const { page, skipIndex } = util.paper(ctx.request.query);
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization)
    try {
        let params = {
            "applyUser.userId": data.userId
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
    }catch(e) {
        ctx.body = util.fail(`查询失败：${e.stack}`)
    }
})
module.exports = router;