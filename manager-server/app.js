const Koa = require('koa')
const app = new Koa() 
const views = require('koa-views')  
const json = require('koa-json') //把参数转成koa对象
const onerror = require('koa-onerror') //错误监听
const bodyparser = require('koa-bodyparser')//前端请求参数的转换
//const logger = require('koa-logger') //日志
var log4js = require("./utils/log4j");
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt =require('koa-jwt')
const util = require('./utils/util') 
const menus = require('./routes/menus')
const users = require('./routes/users')
const roles = require('./routes/roles')
require('./config/db')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'] //可以接受各种格式的请求
}))
app.use(json())

//app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  // const start = new Date()
  await next().catch((err)=>{
    if(err.status == '401'){
      ctx.status = 200;
      ctx.body = util.fail('Token认证失败',util.CODE.AUTH_ERROR)
    }else{
      throw err;
    }
  })
  
})

// routes
//中间件token拦截,防止你在token失效的情况下对接口的调用
//验证token失败的话会抛出401
app.use(koajwt({secret:'mytoken'}).unless({
  //过滤掉登录接口，不然连登录接口都访问不了，也就连token的获取不了了
  path:[/^\/api\/users\/login/]
}))


router.prefix('/api')//加前缀，一级路由
// router.get('/leave/count',(ctx)=>{
//   console.log('=>',ctx.request.headers)
//   // const token = ctx.request.headers.authorization.split(' ')[1];
//   // const payload = jwt.verify(token,'mytoken')
//   ctx.body='hello';
// })
router.use(users.routes(), users.allowedMethods()) //二级路由
router.use(menus.routes(),menus.allowedMethods())
router.use(roles.routes(),roles.allowedMethods())

app.use(router.routes(),router.allowedMethods()) //一级路由（加载所有的路由）
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
