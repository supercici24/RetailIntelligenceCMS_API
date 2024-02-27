const KoaRouter = require('@koa/router')

const roleController = require('../controller/role.controller')
const { verifyAuth } = require('../middleware/verify.middleware')
const roleRouter = new KoaRouter({ prefix: '/role' })

roleRouter.get('/:roleId/menu', verifyAuth, roleController.roleMenu)

module.exports = roleRouter