const connection = require('../app/database')
const mapSqlStatement = require('../utils/mapSqlStatement')

class RoleService {
  async create(roleInfo) {
    const { inserts, placeholders, values } = mapSqlStatement.create(roleInfo)
    console.log("inserts:", inserts, placeholders, values)
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
  async getRoleList(like, limit) {
    const likes = mapSqlStatement.like(like, 'r')
    const sqlLike = likes.length ? `where ${likes.join()}` : ''
    const sqlLimit = limit.length ? `limit ?, ?` : ''
    const statement = `
      select 
      r.id, r.name, r.intro, r.createAt, r.updateAt,
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', m.id, 'name', m.name, 'type', m.type, 'icon', m.icon, 'parentId', m.parentId, 'url', m.url, 'sort', m.sort, 'permission', m.permission, 'createAt', m.createAt,'updateAt', m.updateAt
      )) menuList
      from role r
      left join role_menu rm on rm.roleId = r.id
      left join menu m on m.id = rm.menuId
      ${sqlLike}
      group by r.id
      ${sqlLimit};
    `
    const [result] = await connection.execute(statement, limit)
    return result
  }
  async getRoleByAny(key, value) {
    const statement = `SELECT * FROM role WHERE ${key} = ?;`

    const [result] = await connection.execute(statement, [value])

    return result
  }
}

module.exports = new RoleService()