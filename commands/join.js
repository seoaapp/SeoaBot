/**
 * @name Seoa:Join
 * @description Voice Join
 */

exports.run = ((seoa, msg, settings) => { 
  if (!msg.guild.voiceConnection) {
    msg.member.voiceChannel.join()
  }
})

exports.callSign = ['들어와','join', '들어오기']
exports.helps = {
    description: "보이스 채널에 들어옵니다",
    uses: ">join"
}
