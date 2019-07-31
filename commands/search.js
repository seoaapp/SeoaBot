/**
 * @name Seoa:search
 * @description YouTube Search Command
 */

const ytSearch = require('yt-search')
const randomHexColor = require('random-hex-color')

/** Message */
const locale = {
  en: require('../locales/en.json'),
  kor: require('../locales/kor.json'),
  pt: require('../locales/pt.json')
}

exports.run = (seoa, msg, settings) => {
  /** Message Filter for .awaitMessages() */
  const filter = (m) => m.author.id === msg.author.id

  msg.channel.send(locale[settings.servers[msg.guild.id].lang].YOUTUBEDEVMSG).then((m) => {
    msg.channel.awaitMessages(filter, {
      max: 1,
      time: 60000
    }).then((collect) => {
      if (!collect.first()) {
        m.edit(locale[settings.servers[msg.guild.id].lang].Corrent)
        m.delete(2000)
      } else {
        ytSearch(collect.first().content, (err, res) => {
          if (err) m.channel.send(err)

          const embed = {
            color: parseInt(randomHexColor().substring(1), 16),
            title: '\'' + collect.first().content.slice(0, 200) + locale[settings.servers[msg.guild.id].lang].search,
            fields: []
          }
          res.videos.slice(0, 10).forEach((video, index) => {
            embed.fields.push({
              name: (index + 1) + '. ' + video.title,
              value: locale[settings.servers[msg.guild.id].lang].view.replace('[video.url]', video.url).replace('[video.duration]', video.duration).replace('[video.ago]', video.ago).replace('[video.views]', video.views)
            })
          })
          m.edit({ embed })
          msg.channel.awaitMessages(filter, {
            max: 1,
            time: 60000
          }).then((collect2) => {
            if (!collect2.first()) {
              m.edit(locale[settings.servers[msg.guild.id].lang].Corrent)
              m.delete(2000)
            } else {
              if (collect2) {
                // None
              }
            }
          })
        })
      }
    })
  })
}

exports.callSign = ['search', '검색']
exports.helps = {
  description: 'YouTube에서 검색합니다',
  uses: '>search'
}
