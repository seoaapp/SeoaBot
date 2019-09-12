const Model = require('./model')
module.exports = class ReadyEvent extends Model {
  constructor (client) {
    super(client, 'ready')
  }

  run () {
    console.info(this.user.username + ' is now Online!\n')
    this.user.setActivity(this.config.activity, { type: 'PLAYING' })
  }
}
