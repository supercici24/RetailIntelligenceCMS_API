const userService = require('../service/user.service')
const { splitObj, toString } = require('../utils/transition')
class UserController {
  async create(ctx, next) {
    const user = ctx.request.body

    const result = await userService.create(user)

    ctx.body = {
      message: '创建用户成功',
      data: result
    }
  }
  async detail(ctx, next) {
    const { userId } = ctx.params
    const result = await userService.getUserByID(userId)
    ctx.body = {
      code: 200,
      data: result
    }
  }
  async list(ctx, next) {
    const info = ctx.request.body
    const offset = toString(info.offset)
    const size = toString(info.size)
    const [like] = splitObj(info, ['offset', 'size'])
    let hasLimit = false
    if (offset && size) {
      hasLimit = true
    }

    const result = await userService.getUserList(like, hasLimit ? [offset, size] : [])
    ctx.body = {
      code: 200,
      data: {
        list: result,
        totalCount: result.length
      }
    }
  }
  async delete(ctx, next) {
    const { userId } = ctx.params

    await userService.deleteUserByID(userId)

    ctx.body = {
      code: 200,
      data: '删除用户成功'
    }
  }
}

module.exports = new UserController()