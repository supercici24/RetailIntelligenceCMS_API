// 导入app
const app = require('./app')
const { SERVER_PORT } = require('./config/server')

// 这里引入是为了保证里面的代码能够执行一次，监听error
require('./utils/handle-error')

// 启动app
app.listen(SERVER_PORT, () => {
  console.log('服务器启动成功')
})