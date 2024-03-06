const connection = require('../app/database')

class RoleMenuService {
  async create(roleId, menuId) {
    const statement = `INSERT INTO role_menu (roleId, menuId) VALUES (?, ?);`

    const [result] = await connection.execute(statement, [roleId, menuId])
    return result
  }
  async delete(roleMenuId) {
    const statement = `delete from role_menu where id = ?;`
    const [result] = await connection.execute(statement, [roleMenuId])
    return result
  }
  async getRoleMenuByRoleId(roleId) {
    const statement = `select * from role_menu where roleId = ?;`
    const [result] = await connection.execute(statement, [roleId])
    return result
  }
}

module.exports = new RoleMenuService()