const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/secret')

class LoginController {
  sign(ctx, next) {
    // 1.获取用户信息
    const { id, name } = ctx.user
    // 2.颁发令牌 {id, name}是payload
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 24 * 60 * 60,
      algorithm: 'RS256' //设置算法为非对称加密算法，默认是对称加密
    })

    // 3.返回用户信息
    ctx.body = { code: 0, data: { id, name, token } }
  }
  test(ctx, next) {
    ctx.body = '身份通过'
  }
}

module.exports = new LoginController()