/**
 * @name Seoa:Ping
 * @description Seoa's ping command
 */

/** Message */
const i18n = require('i18n')
const { RichEmbed } = require('discord.js')

exports.run = async (seoa, msg) => {
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]

  let pp = await msg.channel.send('Calculating...')
  let msgp = i18n.__({
    phrase: 'msgping',
    locale: server.lang
  })
  
  let p = i18n.__({
    phrase: 'ping',
    locale: server.lang
  })
  
  let api = i18n.__({
    phrase: 'APIPING',
    locale: server.lang
  })
    
  let pingembed = new RichEmbed()
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
  uses: 'ping'
}
