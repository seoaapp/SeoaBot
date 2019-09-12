const Model = require('./model')
const { RichEmbed } = require('discord.js')
module.exports = class MessageEvent extends Model {
  constructor (client) {
    super(client, 'message')
  }

  run (msg) {
    const prefix = this.config.prefix
    if (!msg.content.startsWith(prefix) || msg.author.bot || !msg.guild) return
    const args = msg.content.substring(prefix.length, msg.content.length).split(' ')
    const cmd = this.commands.get(args[0])
    if (!cmd) return
    const pak = { client: this, Embed: RichEmbed, lang: this.langs.get('ko') }
    cmd.run(msg, args, pak)
  }
}
