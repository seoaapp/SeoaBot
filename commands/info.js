/**
 * @name Seoa:Ping
 * @description Seoa's ping command
 */

const i18n = require('i18n')
const { RichEmbed } = require('discord.js')
const randomHexColor = require('random-hex-color')

exports.run = async (seoa, msg) => {
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]

  let totalSeconds = (seoa.uptime / 1000)
  const days = Math.floor(totalSeconds / 86400)
  totalSeconds %= 86400
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  // UpTime Caculator End
  const embed = new RichEmbed()
    .setTitle(i18n.__({ phrase: 'Info', locale: server.lang }, seoa.user.username))
    .setDescription(i18n.__({ phrase: 'From', locale: server.lang }, msg.author.username))
    .setThumbnail(seoa.user.avatarURL)
    .setColor(parseInt(randomHexColor().substring(1), 16))
    .addField('\u200B', '\u200B', true)
    .addField(i18n.__({ phrase: 'Name&Tag', locale: server.lang }, seoa.user.username), seoa.user.tag, true)
    .addField(i18n.__({ phrase: 'ID', locale: server.lang }, seoa.user.username), seoa.user.id, true)
    .addField(i18n.__({ phrase: 'CommandSize', locale: server.lang }, seoa.user.username), seoa.commands.size, true)
    .addField(i18n.__({ phrase: 'UsersSize', locale: server.lang }, seoa.user.username), seoa.users.size, true)
    .addField(i18n.__({ phrase: 'ChannelsSize', locale: server.lang }, seoa.user.username), seoa.channels.size, true)
    .addField(i18n.__({ phrase: 'ServersSize', locale: server.lang }, seoa.user.username), seoa.guilds.size, true)
    .addField(i18n.__({ phrase: 'BotDay', locale: server.lang }, seoa.user.username), new Date(seoa.user.createdAt), true)
    .addField(i18n.__({ phrase: 'UpdataDay', locale: server.lang }, seoa.user.username), new Date(seoa.readyAt), true)
    .addField(i18n.__({ phrase: 'UpTime', locale: server.lang }, seoa.user.username), i18n.__({ phrase: 'Time', locale: server.lang }, days, hours, minutes, seconds), true)
    .addField(i18n.__({ phrase: 'APIPING', locale: server.lang }, seoa.user.username), Math.round(seoa.ping), true)
  msg.channel.send(embed)
}

exports.callSign = ['']
exports.helps = {
  description: '봇의 정보를 보여줍니다',
  uses: ''
}
