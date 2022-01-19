/**
 * 用户管理模块
 */
const util = require('./../utils/util')
const User = require('./../models/userSchema')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
router.prefix('/users')

//用户登录
router.post('/login',async (ctx)=>{
  //使用try，catch来防止当数据库有问题时也能发现错误
  try{
    const { userName , userPwd} = ctx.request.body;
    //通过findOne去查找取得相应的用户数据数据(查找下面两个字段)
    //差数据表（集合）User里的字段
    /**
     * 返回数据库指定字段，有三种方式
     * 1.'userId userName userEmail state role deptId roleList'
     * 2. {userName:1,_id:0} 1为选择，0不选择（替换上边）
     * 3. .select('userId')
     */ 
    const res = await User.findOne({
      userName,
      userPwd
    },'userId userName userEmail state role deptId roleList')//只返回指定字段
    //签发token给前端
    const data = res._doc;
    console.log('data=>',data)
    const token = jwt.sign({
      data,
    },'mytoken',{expiresIn: '1h' });
    // console.log('token=>',token)
    //数据表里有和用户登录输入的相同的账号密码
    if(res){
      data.token = token;
      ctx.body = util.sucess(data)
    }else{
      ctx.body = util.fail("账号或密码不正确")

    }
  } catch (error){
    ctx.body = util.fail(error.msg)
  }
  
})

router.get('/list',async (ctx)=>{
  const { userId, userName, state, } = ctx.request.query;
  const {page,skipIndex} =  util.paper(ctx.request.query);
  let params = {}
  if (userId) params.userId = userId;
  if (userName) params.userName = userName;
  if (state && state!='0') params.state = state;
  //根据条件查询所有的用户列表
  const query = User.find(params,{_id:0,userPwd:0}) //过滤掉这两个字段
  const list = await query.skip(skipIndex).limit(page.pageSize) //达到分页效果：通过拿到当前在第几页和起始数据
  //统计获取用户的总条数
  const total = await User.countDocuments(params);//mongoose自带API
  
  try{
    ctx.body = util.sucess({
      page:{
        ...page,
        total
      },
      list
    })
  }catch(e){
    ctx.body = util.fail(`查询异常：${e.stack}`)
  }

  




  



})


module.exports = router
