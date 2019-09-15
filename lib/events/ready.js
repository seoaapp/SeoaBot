const Model = require('./model')
const { PlayerManager } = require('discord.js-lavalink')
module.exports = class extends Model {
  constructor (client) {
    super(client, 'ready')
  }

  run () {
    console.info(this.user.username + ' is now Online!')
    this.user.setActivity(this.config.activity, { type: 'PLAYING' })
    if (!this.config.music.useNative) this.player = new PlayerManager(this, this.config.music.lavalinkNodes, { user: this.user.id, shards: 0 })
  }
}
