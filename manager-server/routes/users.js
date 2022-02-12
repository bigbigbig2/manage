/**
 * 用户管理模块
 */
const util = require('./../utils/util')
const User = require('./../models/userSchema')
const Counter = require('./../models/counterScherma')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const md5 = require('md5')
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
    // console.log('data=>',data)
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
//用户列表
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

//用户删除、批量删除
router.post('/delete', async (ctx) =>{
  const { userIds } = ctx.request.body
  //更新表,这的用户删除其实是更新用户的在职状态，将用户的状态修改为离职
  //User.updateMany({userId:'10001},{state:2})将用户id为10001的用户的state更新为2
  // const res = await User.updateMany({ $or:userId},{state:2}) 
  const res = await User.updateMany({userId:{$in: userIds }}, { state: 2 })
  //之前的nmodified变成了modifiedCount
  /*
  console.log(res);
  acknowledged: true,
  modifiedCount: 1,
  upsertedId: null,
  upsertedCount: 0,
  matchedCount: 1 
  */
  if(res.modifiedCount){
    ctx.body = util.sucess(res,`共删除成功${res.modifiedCount}条`)
  }else{
    ctx.body = util.fail('删除失败');
  }
  

})

//用户新增/编辑
router.post('/operate',async (ctx)=>{
  const {userId, userName,userEmail,job,mobile,state,roleList,deptId,action} = ctx.request.body;
  if(action == 'add'){
    if(!userName || !userEmail || !deptId){
      ctx.body = util.fail('参数错误',util.CODE.PARAM_ERROR)
      return;
    }
    const res =await User.findOne({$or:[{userName},{userEmail}]},'_id userName userEmail')
    if(res){
      //新增时先判断用户是否存在（用户名称和用户邮箱不能和以有的重名）
      ctx.body = util.fail(`系统监测到有重复的用户，信息如下:${res.userName} - ${res.userEmail}`)
    }else{
      const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
      //用户创建(实例化并将用户添加到表中)
      try{
        const user = new User({
          userId:doc.sequence_value,
          userName,
          userPwd:md5('123456'),
          userEmail,
          role:1, //默认普通用户
          roleList,
          job,
          state,
          deptId,
          mobile
        })
        user.save();
        ctx.body = util.sucess('','用户创建成功');
      }catch(e){
        ctx.body = util.fail(e.stack,'用户创建失败');
      }
      
    }
  }else{
    //用户编辑
    if(!deptId){
      ctx.body = util.fail('部门不能为空',util.CODE.PARAM_ERROR)
      return;
    }
    try{
      const res = await User.findOneAndUpdate({userId},{job,mobile,state,roleList,deptId})
      ctx.body = util.sucess({},'更新成功')
    }catch(error){
      ctx.body = util.fail(error.stack,'更新失败')
    }

  }
})

//只获取用户名称，用户id，用户name
router.get('/all/list', async (ctx) => {
  try {
    const list =await User.find({}, "userId userName userEmail")
    ctx.body = util.sucess(list)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  } 
})

module.exports = router
