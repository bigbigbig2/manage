const router = require('koa-router')();
const util = require('./../utils/util');
const Menu = require('../models/menuSchema');

router.prefix('/menu')

router.post('/operate',async (ctx)=>{
    const {_id, action, ...params} = ctx.request.body;
    let res, info;
    try {
        if (action == 'add'){
            res = await Menu.create(params)
            info = '创建成功'
        }else if(action == 'edit'){
            params.updateTime = new Date();
            res = await Menu.findByIdAndUpdate(_id,params);
            info = '编辑成功'
        }else{
            //根据本表删除同时还要根据parentId删除它的下代及下下代子节点
            res = await Menu.findByIdAndRemove(_id)
            await Menu.deleteMany({ parentId: {$all: [_id] } } )
            info = '删除成功'
        }
    }catch(error){
        ctx.body = util.sucess('',error);
    }
    ctx.body = util.sucess('',info);
})
//菜单列表查询
//测试
router.get('/list',async (ctx)=>{
    const { menuName, menuState} =ctx.request.query;
    const params = {}
    if(menuName) params.menuName = menuName;
    if(menuState) params.menuState = menuState;
    let rootList = await Menu.find(params) || []//这里找到的数据每个菜单都是同一维的数组

    const permissionList = util.getTreeMenu(rootList,null,[])
    ctx.body = util.sucess(permissionList)
})
// // 递归拼接树形列表(已添加到公共库里)
// function getTreeMenu(rootList, id, list) {
//     //遍历一级菜单（使用判断，如果它的parentId为Null则它为一级菜单，然后添加到list中
//     for (let i = 0; i < rootList.length; i++) {
//         let item = rootList[i]
//         if (String(item.parentId.slice().pop()) == String(id)) {
//             console.log('item=>',item)
//             list.push(item._doc)
//         }
//     }
//     //在递归遍历下一层数组
//     list.map(item => {
//         item.children = []
//         getTreeMenu(rootList, item._id, item.children)
//         if (item.children.length == 0) {
//             delete item.children;
//         } else if (item.children.length > 0 && item.children[0].menuType == 2) {
//             // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
//             item.action = item.children;
//         }
//     })
//     return list;
// }

module.exports =router;