/**
 * @name Seoa:search
 * @description YouTube Search Command
 */

const discord = require('discord.js')
const ytSearch = require('yt-search')
const randomHexColor = require('random-hex-color')

exports.run = (seoa, msg) => {

  /** Message Filter for .awaitMessages() */
  const filter = (m) => m.author.id === msg.author.id

  msg.channel.send('YouTube에서 검색할 검색어를 입력해 주세요 (제한시간 1분) **[Dev]**').then((m) => {
    msg.channel.awaitMessages(filter, {
      max: 1,
      time: 60000
    }).then((collect) => {
      if (!collect.first()) {
        m.edit('1분이 지나 취소되었습니다')
        m.delete(2000)
      } else {
        ytSearch(collect.first().content, (err, res) => {
          if (err) m.channel.send(err)

          let embed = new discord.RichEmbed()
            .setColor(randomHexColor())
            .setTitle('\'' + collect.first().content.slice(0, 200) + '\'의 검색 결과')
          res.videos.slice(0, 10).forEach((video, index) => {
            embed.addField((index + 1) + '. ' + video.title, '[보기](http://youtube.com' + video.url + ') | 길이: ' + video.duration + ' | 게시일: ' + video.ago + ' | ' + video.views + '번 재생됨')
          })
          m.edit(embed)
        })
      }
    })
  })
}

exports.callSign = ['search', '검색']
exports.helps = {
  description: "YouTube에서 검색합니다",
  uses: "~search"
}
