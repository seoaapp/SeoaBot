/**
 * @name Seoa:settings
 * @description settings Command
 */

const fs = require('fs')
/** Message */
const locale = {
  en: require('../locales/en.json'),
  kor: require('../locales/kor.json'),
  pt: require('../locales/pt.json')
}

exports.run = (seoa, msg, settings, query) => {
  if (msg.member.hasPermission('ADMINISTRATOR')) {
    if (query.args[0]) {
      if (['lang', '언어'].includes(query.args[0].toLowerCase())) {
        if (!(query.args[1] === 'kor' || query.args[1] === 'en' || query.args[1] === 'pt')) {
          settings.servers[msg.guild.id].lang = 'en'
          fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
          msg.channel.send(locale[settings.servers[msg.guild.id].lang]['ENMSG'])
        } else {
          settings.servers[msg.guild.id].lang = query.args[1]
          fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
          msg.channel.send(locale[settings.servers[msg.guild.id].lang].Lang.replace('[query.args[1]]', `\`${query.args[1]}\``))
        }
      } else if (['channel', '채널'].includes(query.args[0].toLowerCase())) {
        settings.servers[msg.guild.id].channelnoticeid = msg.mentions.channels.firstKey()
        fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
        msg.channel.send(locale[settings.servers[msg.guild.id].lang].su)
      }
    } else {
      msg.channel.send(locale[settings.servers[msg.guild.id].lang].ch)
    }
  } else {
    msg.channel.send(locale[settings.servers[msg.guild.id].lang].MISS)
  }
}

exports.callSign = ['settings', 'setting', '설정']
exports.helps = {
  description: '서버 설정을 합니다.',
  uses: '>settings'
}
