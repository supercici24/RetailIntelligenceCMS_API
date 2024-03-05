const KoaRouter = require('@koa/router')
const { verifyAuth } = require('../middleware/verify.middleware')
const menuController = require('../controller/menu.controller')

const menuRouter = new KoaRouter({ prefix: '/menu' })

// 查询菜单列表
menuRouter.post('/list', verifyAuth, menuController.list)

module.exports = menuRouter