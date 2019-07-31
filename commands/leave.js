/**
 * @name Seoa:Leave
 * @description Voice Leave
 */

/** Message */
const locale = {
  en: require('../locales/en.json'),
  kor: require('../locales/kor.json'),
  pt: require('../locales/pt.json')
}

exports.run = (seoa, msg, settings) => {
  if (msg.guild.voiceConnection) { // TODO: LEAVE 에러 고치기
    msg.member.voiceChannel.leave()
    msg.channel.send(locale[settings.servers[msg.guild.id].lang].Leave)
  }
}

exports.callSign = ['나가기', 'leave']
exports.helps = {
  description: '음성 채널을 나갑니다',
  uses: '>leave'
}
