const KoaRouter = require('@koa/router')

const { verifyAuth } = require('../middleware/verify.middleware')
const departmentController = require('../controller/department.controller')

const departmentRouter = new KoaRouter({ prefix: '/department' })

departmentRouter.post('/list', verifyAuth, departmentController.list)

module.exports = departmentRouter