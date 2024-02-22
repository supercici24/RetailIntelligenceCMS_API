const app = require('../app')
const { 
  NAME_OR_PASSWORD_IS_REQUIRE, 
  USER_ALREADY_EXIST, 
  NAME_IS_NOT_EXISTS, 
  PASSWORD_IS_INCORRECT, UNAUTHORIZED, OPERATION_NOT_ALLOW 
} = require('../config/error')

app.on('error', (error, ctx) => {
  let code = 0
  let message = ''
  switch (error) {
    case NAME_OR_PASSWORD_IS_REQUIRE:
      code = -1001
      message = '用户名或密码不能为空'
      break
    case USER_ALREADY_EXIST:
      code = -1002
      message = '用户名已存在'
      break
    case NAME_IS_NOT_EXISTS:
      code = -1003
      message = '用户名不存在'
      break
    case PASSWORD_IS_INCORRECT:
      code = -1004
      message = '密码错误'
      break
    case UNAUTHORIZED:
      code = -1005
      message = '无效的token'
      break
    case OPERATION_NOT_ALLOW:
      code = -2001
      message = '没有操作权限'
  }
  ctx.body = { code, message }
})