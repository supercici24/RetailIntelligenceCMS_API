const connection = require("../app/database")
const mapSqlStatement = require("../utils/mapSqlStatement")
const getField = (TName) => {
  return `'id', ${TName}.id, 'name', ${TName}.name, 'type', ${TName}.type, 'sort', ${TName}.sort, 'icon', ${TName}.icon, 'parentId', ${TName}.parentId, 'url', ${TName}.url, 'permission', ${TName}.permission, 'createAt', ${TName}.createAt,'updateAt', ${TName}.updateAt`
}
class menuService {
  async getMenuList(like, limit) {
    const likes = mapSqlStatement.like(like, 'm')

    const sqlLikes = likes.length ? `and ${likes.join(' ')}` : ''
    const sqlLimit = limit.length ? 'limit ?, ?' : ''
    const statement = `
      SELECT
      	m.id, m.name, m.type, m.icon, m.url, m.sort, m.permission, m.createAt, m.updateAt,
      	(SELECT
      		JSON_ARRAYAGG(JSON_OBJECT(${getField('m2')}, 'children', (
      			SELECT
      				JSON_ARRAYAGG(JSON_OBJECT(${getField('m3')}))
      			FROM menu m3 WHERE m3.type = 3 AND m3.parentId = m2.id)))
      	FROM menu m2 WHERE m2.type = 2 AND m2.parentId = m.id) children
      FROM menu m
      WHERE m.type = 1
      ${sqlLikes} ${sqlLimit};
    `
    const [result] = await connection.execute(statement, limit)
    return result
  }
  async getMenuByAny(key, value) {
    const statement = `SELECT * FROM menu WHERE ${key} = ?;`

    const [result] = await connection.execute(statement, [value])

    return result
  }
}
module.exports = new menuService()