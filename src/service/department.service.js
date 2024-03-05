const connection = require('../app/database')
const mapSqlStatement = require('../utils/mapSqlStatement')
class departmentService {
  async getDepartmentList(like, limit) {
    const likes = mapSqlStatement.like(like, 'd')
    const sqlLike = likes.length ? `where ${likes.join()}` : ''
    const sqlLimit = limit.length ? `limit ?, ?` : ''
    const statement = `
      select
      d.id, d.name, d.parentId, d.leader, d.createAt, d.updateAt,
      dc.name parentName
      from department d
      left join department dc on dc.id = d.parentId
      ${sqlLike}
      ${sqlLimit};
    `
    const [result] = await connection.execute(statement, limit)

    return result
  }
  async getDepartmentByAny(key, value) {
    const statement = `SELECT * FROM department WHERE ${key} = ?;`

    const [result] = await connection.execute(statement, [value])

    return result
  }
}

module.exports = new departmentService()