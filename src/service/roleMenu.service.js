const connection = require('../app/database')

class RoleMenuService {
  async create(roleId, menuId) {
    const statement = `INSERT INTO role_menu (roleId, menuId) VALUES (?, ?);`

    const [result] = await connection.execute(statement, [roleId, menuId])
    return result
  }
}

module.exports = new RoleMenuService()