/**
 * @name Seoa:Invite
 * @description Bot Invite Command
 */

/** Message */
const locale = {
  en: require('../locales/en.json'),
  kor: require('../locales/kor.json'),
  pt: require('../locales/pt.json')
}

exports.run = (seoa, msg, settings) => {
  const invite = {
    description: locale[settings.servers[msg.guild.id].lang].Invite
  }
  msg.channel.send({ embed: invite }).then(err => console.log(err))
}

exports.callSign = ['invite', '봇초대링크', '초대링크', 'Invite']
exports.helps = {
  description: '초대링크를 줍니다',
  uses: '>invite'
}
