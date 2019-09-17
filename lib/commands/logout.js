const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['logout', '로그아웃'], 'logout', 'logout', 0, true)
  }

  run (msg, args, p) {
    p.client.destroy()
    process.exit(0)
  }
}
