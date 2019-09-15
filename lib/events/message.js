const Model = require('./model')
const { RichEmbed } = require('discord.js')
module.exports = class extends Model {
  constructor (client) {
    super(client, 'message')
  }

  async run (msg) {
    const prefix = this.config.prefix
    if (!msg.content.startsWith(prefix) || msg.author.bot || !msg.guild) return
    const args = msg.content.substring(prefix.length, msg.content.length).split(' ')
    const cmd = this.commands.get(args[0])
    if (!cmd) return
    const u = await this.gi.getUser(msg.author)
    const g = await this.gi.getGuild(msg.guild)
    const handler = (result) => {
      if (!result || !result.type) return
      if (result.type === 'edit') result.bef.edit(result.aft)
      else if (result.type === 'msg') msg.channel.send(result.aft)
      else if (result.type === 'del') result.bef.delete()
    }

    /**
     * u: 유저 정보
     * g: 길드 정보
     * gi: 유저&길드&마이리스트 정보 로드 모듈
     * lang: 언어 모듈
     * search: 유튜브 검색 모듈
     */
    const pak = { client: this, Embed: RichEmbed, lang: this.langs.get(u.lang), u: u, g: g, gi: this.gi, db: this.db, search: this.search }
    if (cmd.handler) cmd.handler(msg, pak)
    const temp = cmd.run(msg, args, pak)
    if (temp) temp.then ? temp.then(result => handler(result)) : handler(temp)
  }
}
