/**
 * @name Seoa:Notice
 * @description Notice Command
 */

exports.run = (seoa, msg, settings, query) => {
  if (settings.owners.includes(msg.author.id)) {
    seoa.guilds.forEach((guild) => {
      if (settings.servers[guild.id].channelnoticeid !== '') {
        if (!guild.systemChannel) {
          /* 아무채널이나 보내기 */
          guild.owner.send('<@' + guild.ownerID + '> 공지 채널 설정이 되지 않았습니다!\n> 서버장에게 공지를 전송합니다.\n\n' + query.args.toLowerCase())
        } else {
          /* 시스템 채널로 보내기 */
          guild.systemChannel.send(query.args[1])
        }
      } else {
        /* 설정된 채널로 보내기 */
        if (guild.channels.get(settings.servers[guild.id].channelnoticeid)) {
          guild.channels.get(settings.servers[guild.id].channelnoticeid).send(query.args[1])
        }
        msg.channel.send(seoa.channels.get(settings.servers[guild.id].channelnoticeid))
      }
    })
  } else {
    msg.reply('당신은 봇 소유자 (운영자)가 아닙니다!')
  }
}

exports.callSign = ['notice', '공지']
