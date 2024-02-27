const connection = require('../app/database')
const mapSqlStatement = require('../utils/mapSqlStatement')

class RoleService {
  async create(roleInfo) {
    const { inserts, placeholders, values } = mapSqlStatement.create(roleInfo)
    const statement = `INSERT INTO role (${inserts.join()}) VALUES (${placeholders.join()});`

    const [result] = await connection.execute(statement, values)

    return result
  }
  async getRoleMenuById(id) {
    const statement = `
    SELECT 
      JSON_ARRAYAGG(JSON_OBJECT(
      'id', m.id, 'name', m.name, 'type', m.type, 'icon', m.icon, 'parentId', m.parentId, 'url', m.url, 'sort', m.sort, 'permission', m.permission, 'createAt', m.createAt,'updateAt', m.updateAt
      )) menuList
    FROM role r
    LEFT JOIN role_menu rm ON rm.roleId = r.id
    LEFT JOIN menu m ON m.id = rm.menuId
    WHERE r.id = ?;
    `
    const [result] = await connection.execute(statement, [id])
    return result[0].menuList
  }
}

module.exports = new RoleService()