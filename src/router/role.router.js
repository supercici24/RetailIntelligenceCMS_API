const KoaRouter = require('@koa/router')

const { verifyCUInfo } = require('../middleware/verify.middleware')
const roleController = require('../controller/role.controller')
const { verifyAuth } = require('../middleware/verify.middleware')
const roleRouter = new KoaRouter({ prefix: '/role' })

// 创建角色
roleRouter.post('/', verifyAuth, verifyCUInfo, roleController.create)
// 根据id查询用户菜单
roleRouter.get('/:roleId/menu', verifyAuth, roleController.roleMenu)
// 查询角色列表
roleRouter.post('/list', verifyAuth, roleController.roleList)

module.exports = roleRouter