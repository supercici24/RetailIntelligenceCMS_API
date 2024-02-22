const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const registerRouter = require('../router')
const cors = require("@koa/cors")

// 创建app
const app = new Koa()

app.use(bodyParser())
app.use(cors())

registerRouter(app)


module.exports = app