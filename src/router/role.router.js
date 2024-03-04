const KoaRouter = require('@koa/router')

const roleController = require('../controller/role.controller')
const { verifyAuth } = require('../middleware/verify.middleware')
const roleRouter = new KoaRouter({ prefix: '/role' })

// 根据id查询用户菜单
roleRouter.get('/:roleId/menu', verifyAuth, roleController.roleMenu)
// 查询角色列表
roleRouter.post('/list', verifyAuth, roleController.roleList)

module.exports = roleRouter