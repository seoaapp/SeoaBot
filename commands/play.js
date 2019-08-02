/**
 * @name Seoa:Play
 * @description Music Player by YouTube & Spotify & SoundCloud & Music File & Others
 */

const i18n = require('i18n')

const ytdl = require('ytdl-core')

exports.run = (seoa, msg, settings) => {
  const targetUrl = msg.content.split(' ')[1]
  try {
    if (
      msg.content.includes('youtube.com') ||
      msg.content.includes('youtu.be')
    ) {
      if (msg.member.voiceChannel) {
        if (!msg.guild.voiceConnection) {
          msg.member.voiceChannel.join()
        }
        msg.guild.voiceConnection.playStream(
          ytdl(targetUrl, { audioonly: true }),
          { volume: 0.5 }
        )
      } else {
        msg.channel.send(
          i18n.__({
            phrase: 'NOTJOIN',
            locale: settings.servers[msg.guild.id].lang
          })
        )
      }
    } else if (msg.content.includes('soundcloud')) {
    } else if (msg.content.includes('spotify')) {
    } else if (msg.content.includes('')) {
      if (msg.member.voiceChannel) {
        if (!msg.guild.voiceConnection) {
          msg.member.voiceChannel.join()
        }
        msg.guild.voiceConnection.playStream(
          msg.attachments.map((v) => v.url),
          { audioonly: true },
          { volume: 0.5 }
        )
      } else {
        msg.channel.send(
          i18n.__({
            phrase: 'NOTJOIN',
            locale: settings.servers[msg.guild.id].lang
          })
        )
      }
    }
  } catch (e) {
    console.log(URLSearchParams(e))
    msg.channel.send(
      i18n.__({
        phrase: 'NOTURL',
        locale: settings.servers[msg.guild.id].lang
      })
    )
  }
}

exports.callSign = ['플렝', '노래', '시작', 'play']
exports.helps = {
  description: '노래를 재생해드릴께요~',
  uses: '>play'
}
