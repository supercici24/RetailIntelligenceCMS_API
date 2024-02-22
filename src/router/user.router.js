const KoaRouter = require('@koa/router')
const UserController = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')

// 创建路由对象
const userRouter = new KoaRouter({ prefix: '/users' })

// 定义路由中的映射
// 用户注册接口
userRouter.post('/', verifyUser, handlePassword, UserController.create)

// 导出路由
module.exports = userRouter