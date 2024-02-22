const userService = require('../service/user.service')
class UserController {
  async create(ctx, next) {
    const user = ctx.request.body

    const result = await userService.create(user)

    ctx.body = {
      message: '创建用户成功',
      data: result
    }
  }
}

module.exports = new UserController()