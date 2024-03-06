const KoaRouter = require('@koa/router')
const UserController = require('../controller/user.controller')
const { handlePassword } = require('../middleware/user.middleware')
const { verifyAuth, verifyCUInfo } = require('../middleware/verify.middleware')
// 创建路由对象
const userRouter = new KoaRouter({ prefix: '/users' })

// 定义路由中的映射
// 用户注册接口
userRouter.post('/', verifyAuth, verifyCUInfo, handlePassword, UserController.create)

// 根据id查询查询
userRouter.get('/:userId', verifyAuth, UserController.detail)
// 查询用户列表
userRouter.post('/list', verifyAuth, UserController.list)
// 删除用户数据
userRouter.delete('/:userId', verifyAuth, UserController.delete)
// 编辑
userRouter.patch('/:userId', verifyAuth, UserController.edit)
// 导出路由
module.exports = userRouter