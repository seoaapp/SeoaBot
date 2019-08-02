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

  msg.channel.send(i18n.__({phrase: 'YOUTUBEDEVMSG', locale: settings.servers[msg.guild.id].lang})).then((m) => {
    msg.channel.awaitMessages(filter, {
      max: 1,
      time: 60000
    }).then((collect) => {
      if (!collect.first()) {
        m.edit(i18n.__({phrase: 'Corrent', locale: settings.servers[msg.guild.id].lang}))
        m.delete(2000)
      } else {
        ytSearch(collect.first().content, (err, res) => {
          if (err) m.channel.send(err)

          const embed = {
            color: parseInt(randomHexColor().substring(1), 16),
            title: '\'' + i18n.__({phrase: 'search', locale: settings.servers[msg.guild.id].lang}, collect.first().content.slice(0, 200)),
            fields: []
          }
          res.videos.slice(0, 10).forEach((video, index) => {
            embed.fields.push({
              name: (index + 1) + '. ' + video.title,
              value: i18n.__({phrase: 'view', locale: settings.servers[msg.guild.id].lang}, video.url, video.duration, video.ago, video.views)
            })
          })
          m.edit({ embed })
          msg.channel.awaitMessages(filter, {
            max: 1,
            time: 60000
          }).then((collect2) => {
            if (!collect2.first()) {
              m.edit(i18n.__({phrase: 'Corrent', locale: settings.servers[msg.guild.id].lang}))
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
