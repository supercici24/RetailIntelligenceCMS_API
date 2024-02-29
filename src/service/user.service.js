const connection = require('../app/database')
const mapSqlStatement = require('../utils/mapSqlStatement')
class UserService {
  async create(userInfo) {
    const { insert, placeholder, values } = mapSqlStatement.create(userInfo)

    const statement = `INSERT INTO users (${insert.join()}) VALUES (${placeholder.join()})`

    const [result] = await connection.execute(statement, values)
    return result
  }
  // 查询数据库
  async findUserByName(name) {
    const statement = 'SELECT * FROM users WHERE name = ?'
    const [valuse] = await connection.execute(statement, [name])
    return valuse
  }
  // 根据id查询用户信息
  async getUserByID(userId) {
    const statement = `
      SELECT
        u.id, u.name, u.realname, u.cellphone, u.enable, u.createAt, u.updateAt, u.avatarUrl,
      	JSON_OBJECT(
          'id', r.id, 'name', r.name, 'intro', r.intro, 'createAt', r.createAt,'updateAt', r.updateAt
        ) role,
      	JSON_OBJECT(
          'id', d.id, 'name', d.name, 'parentId', d.parentId, 'leader', d.leader, 'createAt', d.createAt, 'updateAt', d.updateAt
        ) depatment
      FROM users u
      LEFT JOIN role r ON r.id = u.roleId
      LEFT JOIN department d ON d.id = u.departmentId
      WHERE u.id = ?;
    `
    const [result] = await connection.execute(statement, [userId])
    return result[0]
  }
  // 查询用户列表
  async getUserList(like, limit) {
    const likes = mapSqlStatement.like(like, 'u')

    const sqlLimit = limit.length ? 'limit ?, ?' : ''
    const sqlLike = likes.length ? `where ${likes.join('')}` : ''
    const statement = `
      select 
        u.id, u.name, u.realname, u.cellphone, u.enable, u.createAt, u.updateAt,
        d.name departmentName, r.id roleId, r.name roleName
      from users u
      left join role r on u.roleId = r.id
      left join department d on u.departmentId = d.id 
      ${sqlLike}
      ${sqlLimit};
      `
    const [result] = await connection.execute(statement, limit)
    return result
  }
}

module.exports = new UserService()