const Model = require('./model')
const conv = require('utimets')
module.exports = class extends Model {
  constructor () {
    super([ 'botinfo', '봇정보'], 'botinfo', 'botinfo')
  }

  run (msg, args, p) {
    const u = conv(p.client.uptime / 1000)
    const _ = new Date(p.client.user.createdAt)
    const U = conv((new Date() - _.getTime()) / 1000)
    const embed = new p.Embed().setColor('RANDOM')
      .setTitle(p.lang.get('Info', [p.client.user.username]))
      .setDescription(p.lang.get('From', [msg.author.username]))
      .setThumbnail(p.client.user.avatarURL)
      .addField('\u200B', '\u200B', true)
      .addField(p.lang.get('Name&Tag', [p.client.user.username]), p.client.user.tag, true)
      // .addField(p.lang.get('ID', [p.client.user.username]), p.client.user.id, true)
      .addField(p.lang.get('CommandSize', [p.client.user.username]), Object.keys(p.client.commandsOrigin).length, true)
      .addField(p.lang.get('UsersSize', [p.client.user.username]), p.client.users.size, true)
      .addField(p.lang.get('ChannelsSize', [p.client.user.username]), p.client.channels.size, true)
      .addField(p.lang.get('ServersSize', [p.client.user.username]), p.client.guilds.size, true)
      .addField(p.lang.get('BotDay', [p.client.user.username]), `${_}\n${p.lang.get('Time', [U[0], U[1], U[2], Math.floor(U[3])])}`, true)
      .addField(p.lang.get('UpdataDay', [p.client.user.username]), p.lang.get('Time', [u[0], u[1], u[2], Math.floor(u[3])]))
    return { type: 'msg', aft: embed }
  }
}
