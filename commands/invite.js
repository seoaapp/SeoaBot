/**
 * @name Seoa:Invite
 * @description Bot Invite Command
 */

/** Message */
const i18n = require('i18n')

exports.run = (seoa, msg, settings) => {
  const invite = {
    description: i18n.__({
      phrase: 'Invite',
      locale: settings.servers[msg.guild.id].lang
    })
  }
  msg.channel.send({ embed: invite }).then((err) => console.log(err))
}

exports.callSign = ['invite', '봇초대링크', '초대링크', 'Invite']
exports.helps = {
  description: '초대링크를 줍니다',
  uses: '>invite'
}
