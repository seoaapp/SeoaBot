/**
 * @name Seoa:Play
 * @description Music Player by YouTube & Spotify & SoundCloud & Music File & Others
 */

const discord = require('discord.js')
const ytdl = require('ytdl-core') 

exports.run = ((seoa, msg, settings) => { 
  let targetUrl = msg.content.split(' ')[1]
  try {
  if (msg.content.includes('youtube.com') || msg.content.includes('youtu.be')) {
    if (msg.member.voiceChannel) {
      if (!msg.guild.voiceConnection) {
        msg.member.voiceChannel.join()
      }
      msg.guild.voiceConnection.playStream(ytdl(targetUrl, { audioonly: true }), { volume: 0.5 })
    } else {
      msg.channel.send('삐빅! 음성채널에 들어와 있지 않습니다!')
    }
  } else if (msg.content.includes('soundcloud')) {
    
  } else if (msg.content.includes('spotify')) {
  
  }else if(msg.content.includes("")){ 
      if (msg.member.voiceChannel) {
          if (!msg.guild.voiceConnection) {
              msg.member.voiceChannel.join()
          }
          msg.guild.voiceConnection.playStream(msg.attachments.map(v => v.url), { audioonly: true }, { volume: 0.5 })
      } else {
          msg.channel.send('삐빅! 음성채널에 들어와 있지 않습니다!')
      }
  } 
}catch(e) {
    msg.channel.send('삐빅! 지원하지 않는 URL입니다.')
  }
})

exports.callSign = ['플렝','노래', '시작', 'play']
exports.helps = {
    description: "노래를 재생해드릴께요~",
    uses: "/play"
}
