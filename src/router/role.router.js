const KoaRouter = require('@koa/router')

const roleRouter = new KoaRouter({ prefix: '/role' })

roleRouter.get('/:roleId/menu')

module.exports = roleRouter