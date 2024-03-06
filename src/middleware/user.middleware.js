const userService = require('../service/user.service')
const { NAME_OR_PASSWORD_IS_REQUIRE, USER_ALREADY_EXIST } = require('../config/error')
const md5password = require('../utils/md5-password')

// const verifyUser = async (ctx, next) => {
//   const { name, password } = ctx.request.body
//   if (!name || !password) {
//     return ctx.app.emit('error', NAME_OR_PASSWORD_IS_REQUIRE, ctx)
//   }

//   // 验证用户name在数据库中是否已存在
//   const users = await userService.findUserByName(name)
//   if (users.length) {
//     return ctx.app.emit('error', USER_ALREADY_EXIST, ctx)
//   }

//   await next()
// }

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body

  // 对密码进行加密
  ctx.request.body.password = await md5password(password)

  await next()
}

module.exports = {
  // verifyUser,
  handlePassword
}