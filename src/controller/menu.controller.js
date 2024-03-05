const menuService = require("../service/menu.service")
const { toString, splitObj } = require("../utils/transition")

class menuController {
  async list(ctx, next) {
    const info = ctx.request.body
    const offset = toString(info.offset)
    const size = toString(info.size)
    const [like] = splitObj(info, ['offset', 'size'])

    let hasLimit = false
    if (offset && size) {
      hasLimit = true
    }

    const result = await menuService.getMenuList(
      like,
      hasLimit ? [offset, size] : []
    )

    ctx.body = {
      code: 200,
      data: {
        list: result,
        totalCount: result.length
      }
    }
  }
}
module.exports = new menuController()