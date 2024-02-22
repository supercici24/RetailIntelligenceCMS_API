const mysql2 = require('mysql2')

// 创建连接池
const connectionPool = mysql2.createPool({
  host: 'localhost',
  port: 3306,
  database: 'retailintelligencecms_db',
  user: 'root',
  password: 'SuperCiCi@zx123_com',
  connectionLimit: 5
})

// 获取连接是否成功
connectionPool.getConnection((err, connection) => {
  if (err) {
    console.log('建立连接失败', err);
    return
  }
  connection.connect((err) => {
    if (err) {
      console.log('数据库连接失败', err);
      return
    } else {
      console.log('数据库连接成功');
    }
  })
})

// 获取到连接池中连接对象
const connection = connectionPool.promise()

module.exports = connection

