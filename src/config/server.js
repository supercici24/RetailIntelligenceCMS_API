const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  SERVER_PORT
} = process.env //解构出SERVER_PORT再导出