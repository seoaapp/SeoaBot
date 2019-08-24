/**
 * @name Seoa:Mylist
 * @description none
 */

/** Message */
const i18n = require('i18n')
const { RichEmbed } = require('discord.js')

exports.run = async (seoa, msg, query) => {
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]

  let mylist = await seoa.db.select('mylist', { name: query.args[1] })
  console.log(mylist)
  mylist = mylist[0]
  if (mylist && (typeof mylist.list) !== 'object') mylist.list = JSON.parse(mylist.list)

  if (query.args[0] === 'create' && query.args[1]) {
    seoa.db.insert('mylist', { name: query.args[1], author: msg.author.id, list: JSON.stringify([]) })
  } else if (query.args[0] === 'add' && query.args[1] && query.args[2]) {
    if (mylist.author !== msg.author.id) return
    let q = query.args.splice(2).join(' ')
    if (q.startsWith('u:')) {
      mylist.list.push(q.replace('u:', ''))
    } else if (q.startsWith('s:')) {
      let list = await seoa.search._(q.replace('s:', ''), 5)
      mylist.list.push(list.items[0].id.videoId)
    }

    seoa.db.update('mylist', { list: JSON.stringify(mylist.list) }, { id: mylist.id })
  }
}

exports.callSign = ['mylist', '재생목록', '마이리스트']
exports.helps = {
  description: '재생목록',
  uses: 'mylist'
}
