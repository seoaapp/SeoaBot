/**
 * @name Seoa:Ping
 * @description Seoa's ping command
 */

/** Message */
const i18n = require('i18n')
const { RichEmbed } = require('discord.js')

exports.run = async (seoa, msg, settings) => {
  const pp = await msg.channel.send('Calculating...')

  const msgp = i18n.__({
    phrase: 'msgping',
    locale: settings.servers[msg.guild.id].lang
  })
  const p = i18n.__({
    phrase: 'ping',
    locale: settings.servers[msg.guild.id].lang
  })
  const api = i18n.__({
    phrase: 'APIPING',
    locale: settings.servers[msg.guild.id].lang
  })

  const pingembed = new RichEmbed()
    .setTitle(p)
    .setColor('RANDOM')
    .setDescription(`${msgp} ${pp.createdTimestamp - msg.createdTimestamp}ms\n${api} ${Math.round(seoa.ping)}ms`)
    .setFooter(msg.author.username, msg.author.avatarURL)
    .setTimestamp()
  pp.edit(pingembed)
}

exports.callSign = ['ping', '핑', '퐁', 'pong', 'pn']
exports.helps = {
  description: '봇의 핑을 보여줍니다.',
  uses: '>ping'
}
