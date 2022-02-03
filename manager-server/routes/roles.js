/**
 * 角色管理模块
 */
const util = require('./../utils/util')
const Role= require('./../models/roleSchema')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const md5 = require('md5')
router.prefix('/roles')

//获取全部角色名称(在用户管理模块中的编辑功能中使用到)
router.get('/allList', async (ctx) => {
  try {
    const list = await Role.find({},"_id roleName")
    ctx.body = util.sucess(list);
  } catch (e) {
    ctx.body = util.fail(`查询失败:${e.stack}`)
  }
})
//获取角色列表（包含角色信息），是需要使用到分页的
router.get('/list', async (ctx) => {
  const { roleName } = ctx.request.query;
  const {page,skipIndex} = util.paper(ctx.request.query)
  try {
    let params =  {}
    if(roleName)params.roleName = roleName
    const query= Role.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Role.countDocuments(params); 
    ctx.body = util.sucess({
      list,
      page: {
        ...page,
        total
      }
    })
  } catch (err) {
    ctx.body = util.fail(`查询失败:${error.stack}`)
  }
})
//角色创建，编辑，删除
router.post('/operate', async (ctx) => {
  const { _id, roleName, remark, action } = ctx.request.body;
  let res, info;
  if (action == 'create') {
    res = await Role.create({roleName, remark})
    info = "创建成功"
  } else if (action == 'edit') {
    let params = { roleName, remark }
    params.update = new Date();
    res = await Role.findByIdAndUpdate(_id, params)
    info = '编辑成功'
  } else {
    res = await Role.findByIdAndRemove(_id)
    info="删除成功"
  }
  ctx.body = util.sucess(res,info)
})
//权限设置
router.post('/update/permission', async (ctx) => {
  const { _id, permissionList } = ctx.request.body;
  try {
    let params = {permissionList,update:new Date()}
    let res = await Role.findByIdAndUpdate(_id, params)
    ctx.body = util.sucess(res,"权限设置成功")
  } catch (err) {
    ctx.body =util.fail(res,"权限设置失败")
  }
} )
module.exports = router 
