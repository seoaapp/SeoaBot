/**
 * @name Seoa:Leave
 * @description Voice Leave
 */

exports.run = (seoa, msg, settings) => {
  if (msg.guild.voiceConnection) { // TODO: LEAVE 에러 고치기
    msg.member.voiceChannel.leave()
    msg.channel.send('음성 채널을 떠났습니다!')
  }
}

exports.callSign = ['나가기', 'leave']
exports.helps = {
  description: '음성 채널을 나갑니다',
  uses: '>leave'
}
