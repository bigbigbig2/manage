const router = require('koa-router')()
const util = require('./../utils/util')
const Dept = require('./../models/deptSchema')

router.prefix('/dept')

//部门列表
router.get('/list', async (ctx) => {
    let { deptName } = ctx.request.query;
    let params = {};
    if (deptName) {
        params.department = deptName;
    }
    let rootList = await Dept.find(params);
    //输入部门名称查询
    if (deptName) {
        ctx.body = util.sucess(rootList)
    //查询全部
    } else {
        let tressList = getTreeDept(rootList,null,[])
        ctx.body = util.sucess(tressList)
    }
})
//递归调用树形列表
function getTreeDept(rootList, id, list) {
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
        getTreeDept(rootList, item._id, item.children)
        if (item.children.length == 0) {
            delete item.children;
        }
    })
    return list;
}

//部门创建，编辑，删除
router.post('/operate', async (ctx) => {
    let { _id,action,...params} = ctx.request.body;
    let  info;
    try {
        if (action == 'create') {
            await Dept.create(params);
            info = '创建成功'
        } else if (action == "edit") {
            params.updateTime = new Date();
            await Dept.findByIdAndUpdate(_id,params)
            info = '编辑成功'
        } else if (action == 'delete') {
            await Dept.findByIdAndRemove(_id); 
            await Dept.deleteMany({ parentId: { $all: [_id] } })
            info = "删除成功"
        }
        ctx.body =util.sucess('',info)
    } catch (e) {
        ctx.body = util.fail(error.stack)
    }
})
module.exports = router 
