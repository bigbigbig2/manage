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



module.exports =router;