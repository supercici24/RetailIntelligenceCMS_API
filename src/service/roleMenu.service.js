const connection = require('../app/database')

class RoleMenuService {
  async create(roleId, menuId) {
    const statement = `INSERT INTO role_menu (role_id, menu_id) VALUES (?, ?);`

    const [result] = await connection.execute(statement, [roleId, menuId])
    return result
  }
}

module.exports = new RoleMenuService()