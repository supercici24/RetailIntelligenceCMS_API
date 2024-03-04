const roleService = require('../service/role.service')
const roleMenuService = require('../service/roleMenu.service')
const { toString, splitObj } = require('../utils/transition')
const { menuListHandle } = require('../utils/menuHandle')
class roleController {
  async create(ctx, next) {
    const info = ctx.request.body
    const [roleInfo, { menuList }] = splitObj(info, ['menuList'])

    const roleResult = await roleService.create(roleInfo)

    for (const menuId of menuList) {
      await roleMenuService.create(roleResult.insertId, menuId)
    }

    ctx.body = {
      code: 0,
      data: `创建${roleInfo.name}成功`
    }
  }
  async roleMenu(ctx, next) {
    const { roleId } = ctx.params
    const menuList = await roleService.getRoleMenuById(roleId)

    const result = menuListHandle(menuList)

    ctx.body = {
      code: 200,
      data: result
    }
  }
  async roleList(ctx, next) {
    const info = ctx.request.body
    const offset = toString(info.offset)
    const size = toString(info.size)
    const [like] = splitObj(info, ['offset', 'size'])

    let hasLimit = false
    if (offset && size) {
      hasLimit = true
    }

    const roleResult = await roleService.getRoleList(
      like,
      hasLimit ? [offset, size] : []
    )
    // 处理 menuList
    for (const role of roleResult) {
      role.menuList = menuListHandle(role.menuList)
    }
    ctx.body = {
      code: 200,
      data: {
        list: roleResult,
        totalCount: roleResult.length
      }
    }
  }
}

module.exports = new roleController()