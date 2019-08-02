/**
 * @name Seoa:Notice
 * @description Notice Command
 */

const i18n = require('i18n')

exports.run = (seoa, msg, settings, query) => {
  if (settings.owners.includes(msg.author.id)) {
    seoa.guilds.forEach((guild) => {
      if (settings.servers[guild.id].channelnoticeid === '') {
        // 서버장에게 전송
        // guild.owner.send('<@' + guild.ownerID + '> 공지 채널 설정이 되지 않았습니다!\n> 서버장에게 공지를 전송합니다.\n\n' + query.args[0].toLowerCase())
      } else {
        /* 설정된 채널로 보내기 */
        if (guild.channels.get(settings.servers[guild.id].channelnoticeid)) {
          guild.channels
            .get(settings.servers[guild.id].channelnoticeid)
            .send(query.message.slice(query.command.length + 1))
        }
        // console.log(guild.channels.get(settings.servers[guild.id].channelnoticeid))
      }
    })
  } else {
    msg.reply(
      i18n.__({ phrase: '404', locale: settings.servers[msg.guild.id].lang })
    )
  }
}

exports.callSign = ['notice', '공지']
