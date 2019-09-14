const Model = require('./model')
const ytdl = require('ytdl-core')
const { song } = require('umusicts')

module.exports = class extends Model {
  constructor () {
    super(['mylist', '재생목록', '마이리스트'], 'mylist', 'mylist')
  }

  async run (msg, args, p) {
    const embed = new p.Embed()
    if (args[1] && args[2]) {
      let myList = await p.gi.getMyList(args[2])
      if (args[1] === 'create') {
        if (myList) return embed.setDescription('이미 존재하는 재생목록입니다.')
        p.db.insert('mylist', { name: args[2], author: msg.author.id, list: JSON.stringify([]) })
        embed.setDescription(`성공적으로 '${args[2]}'를 생성하였습니다!`)
      } else if (args[1] === 'add') {
        if (!myList) embed.setDescription('재생목록이 존재하지 않습니다.')
        else if (!args[3]) embed.setDescription('query를 입력해 주세요.')
        else {
          const query = args.splice(3).join(' ').split(':')
          if (query.length !== 2) return
          if (query[0] === 'u') {
            myList.add(query[1])
            embed.setDescription(query[1])
          } else if (query[0] === 's') {
            const res = await p.search._(query[1], 5)
            const inf = await ytdl.getInfo(res.items[0].id.videoId)
            const temp = new song(inf)
            myList.add(temp.url)
            embed.setDescription(temp.url)
          }
        }
      }
    } else embed.setDescription('잘못된 사용법')
    return { type: 'msg', aft: embed }
  }
}
