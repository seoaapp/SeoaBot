/**
 * @name Seoa:settings
 * @description settings Command
 */

const fs = require('fs')

const i18n = require('i18n')

exports.run = (seoa, msg, settings, query) => {
  if (msg.member.hasPermission('ADMINISTRATOR')) {
    if (query.args[0]) {
      if (['lang', '언어'].includes(query.args[0].toLowerCase())) {
        if (
          !(
            query.args[1] === 'kor' ||
            query.args[1] === 'en' ||
            query.args[1] === 'pt'
          )
        ) {
          settings.servers[msg.guild.id].lang = 'en'
          fs.writeFileSync(
            './ServerData/servers.json',
            JSON.stringify(settings.servers, null, '  ')
          )
          msg.channel.send(
            i18n.__({
              phrase: 'ENMSG',
              locale: settings.servers[msg.guild.id].lang
            })
          )
        } else {
          settings.servers[msg.guild.id].lang = query.args[1]
          fs.writeFileSync(
            './ServerData/servers.json',
            JSON.stringify(settings.servers, null, '  ')
          )
          msg.channel.send(
            i18n.__(
              { phrase: 'Lang', locale: settings.servers[msg.guild.id].lang },
              query.args[1]
            )
          )
        }
      } else if (['channel', '채널'].includes(query.args[0].toLowerCase())) {
        settings.servers[
          msg.guild.id
        ].channelnoticeid = msg.mentions.channels.firstKey()
        fs.writeFileSync(
          './ServerData/servers.json',
          JSON.stringify(settings.servers, null, '  ')
        )
        msg.channel.send(
          i18n.__({ phrase: 'su', locale: settings.servers[msg.guild.id].lang })
        )
      }
    } else {
      msg.channel.send(
        i18n.__({ phrase: 'ch', locale: settings.servers[msg.guild.id].lang })
      )
    }
  } else {
    msg.channel.send(
      i18n.__({ phrase: 'MISS', locale: settings.servers[msg.guild.id].lang })
    )
  }
}

exports.callSign = ['settings', 'setting', '설정']
exports.helps = {
  description: '서버 설정을 합니다.',
  uses: '>settings'
}
