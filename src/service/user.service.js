const connection = require('../app/database')
class UserService {
  async create(user) {
    const { name, password } = user

    const statement = 'INSERT INTO `users` (name, password) VALUES (?, ?)'

    const [result] = await connection.execute(statement, [name, password])
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
}

module.exports = new UserService()