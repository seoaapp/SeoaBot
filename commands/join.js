/**
 * @name Seoa:Join
 * @description Voice Join
 */

exports.run = (seoa, msg) => {
  let channel = msg.member.voiceChannel
  let here = seoa.m._(msg.guild.id)
  if (channel) here.join(channel)
  else return
}

exports.callSign = ['들어와', 'join', '들어오기']
exports.helps = {
  description: '보이스 채널에 들어옵니다',
  uses: 'join'
}
