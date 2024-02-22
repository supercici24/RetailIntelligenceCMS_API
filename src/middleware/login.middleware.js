const { UNAUTHORIZED, NAME_OR_PASSWORD_IS_REQUIRE, NAME_IS_NOT_EXISTS, PASSWORD_IS_INCORRECT } = require('../config/error')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')
const { PUBLIC_KEY } = require('../config/secret')
const jwt = require('jsonwebtoken')

const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body
  // 1.验证用户名和密码是否为空
  if (!name || !password) {
    return ctx.app.emit('error', NAME_OR_PASSWORD_IS_REQUIRE, ctx)
  }
  // 2.查询用户是否存在
  const users = await userService.findUserByName(name)
  const user = users[0]
  if (!user) {
    return ctx.app.emit('error', NAME_IS_NOT_EXISTS, ctx)
  }
  // 3.如果用户存在，那么查询数据库中密码和用户传递的密码是否一致
  if (user.password !== md5password(password)) {
    return ctx.app.emit('error', PASSWORD_IS_INCORRECT, ctx)
  }

  // 4.将user对象保存在ctx中
  ctx.user = user

  // 执行next, 下一个中间件
  await next()
}

const verifyAuth = async (ctx, next) => {
  // 授权信息
  const authorization = ctx.headers.authorization
  if (!authorization) {
    return ctx.app.emit('error', UNAUTHORIZED, ctx)
  }
  // 获取token
  const token = authorization.replace('Bearer ', '')
  // 验证token是否是有效的
  try {
    // 获取token中的信息
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    // 将token的信息保存下来
    ctx.user = result
    // 执行下一个中间件
    await next()

  } catch (error) {
    ctx.app.emit('error', UNAUTHORIZED, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth
}