const fs = require('fs')

function registerRouter(app) {
  // 读取当前文件夹下的所有文件
  const files = fs.readdirSync(__dirname)

  // 遍历所有文件
  for (const file of files) {
    // 如果不是以.router.js结尾的文件，就结束，直接进入下一个循环
    if (!file.endsWith('.router.js')) continue

    const router = require(`./${file}`) //引入当前目录下的router文件

    app.use(router.routes())
    app.use(router.allowedMethods())

  }
}

module.exports = registerRouter