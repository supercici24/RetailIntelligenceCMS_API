const roleService = require('../service/role.service')
const roleMenuService = require('../service/roleMenu.service')
const { splitObj } = require('../utils/transition')
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
}

module.exports = new roleController()