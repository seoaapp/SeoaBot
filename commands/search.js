/**
 * @name Seoa:search
 * @description YouTube Search Command
 */

const ytSearch = require('yt-search')
const randomHexColor = require('random-hex-color')

const i18n = require('i18n')

exports.run = async (seoa, msg, settings) => {
  /** Message Filter for .awaitMessages() */
  let server = await settings.db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  const filter = (m) => m.author.id === msg.author.id

  msg.channel
    .send(
      i18n.__({
        phrase: 'YOUTUBEDEVMSG',
        locale: server.lang
      })
    )
    .then((m) => {
      msg.channel
        .awaitMessages(filter, {
          max: 1,
          time: 60000
        })
        .then((collect) => {
          if (!collect.first()) {
            m.edit(
              i18n.__({
                phrase: 'Corrent',
                locale: server.lang
              })
            )
            m.delete(2000)
          } else {
            ytSearch(collect.first().content, (err, res) => {
              if (err) m.channel.send(err)

              const embed = {
                color: parseInt(randomHexColor().substring(1), 16),
                title:
                  "'" +
                  i18n.__(
                    {
                      phrase: 'search',
                      locale: server.lang
                    },
                    collect.first().content.slice(0, 200)
                  ),
                fields: []
              }
              res.videos.slice(0, 10).forEach((video, index) => {
                embed.fields.push({
                  name: index + 1 + '. ' + video.title,
                  value: i18n.__(
                    {
                      phrase: 'view',
                      locale: server.lang
                    },
                    video.url,
                    video.duration,
                    video.ago,
                    video.views
                  )
                })
              })
              m.edit({ embed })
              msg.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 60000
                })
                .then((collect2) => {
                  if (!collect2.first()) {
                    m.edit(
                      i18n.__({
                        phrase: 'Corrent',
                        locale: server.lang
                      })
                    )
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
