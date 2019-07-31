/**
 * @name Seoa:settings
 * @description settings Command
 */

const fs = require('fs')

exports.run = (seoa, msg, settings, query) => {
  // TODO: 대충 언어설정이랑 서버장일경우 공지 채널 설정하는 내용
  if (query.args[0]) {
    if (['lang', '언어'].includes(query.args[0].toLowerCase())) {
      if (!(query.args[1] === 'kor' || query.args[1] === 'en')) {
        settings.servers[msg.guild.id].lang = 'en'
        fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
        msg.channel.send('해당 언어는 정의되어 있지 않아 `en`으로 설정되었습니다.')
      } else {
        settings.servers[msg.guild.id].lang = query.args[1]
        fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
        msg.channel.send(`\`${query.args[1]}\`` + '으로 설정되었습니다.')
      }
    } else if (['channel', '채널'].includes(query.args[0].toLowerCase())) {
      settings.servers[msg.guild.id].channelnoticeid = msg.mentions.channels.firstKey()
      fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
      msg.channel.send('성공!')
    }
  } else {
    msg.channel.send('`채널, 언어` 중에서 하나를 골라주세요')
  }
}

exports.callSign = ['settings', 'setting', '설정']
exports.helps = {
  description: '서버 설정을 합니다.',
  uses: '>settings'
}
