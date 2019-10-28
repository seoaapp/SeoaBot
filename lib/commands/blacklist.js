const Model = require('./model')
const addAlias = ['add', 'create', 'push', '추가', 'assign', 'assignment', '등록']
const delAlias = ['del', 'remove', 'delete', '삭제', '제거']
module.exports = class extends Model {
  constructor () {
    super(['blacklist', 'black', '블랙리스트', '블랙'], 'blacklist', 'blacklist')
  }

  run (msg, args, p) {
    const embed = new p.Embed()
    const targets = msg.mentions.members
    let type = -1
    if (addAlias.includes(args[1])) type = 1
    else if (delAlias.includes(args[1])) type = 0

    if (type === -1) return
    targets.forEach(t => {
      p.db.update('userdata', { isBlacklist: type }, { id: t.id })
    })
    embed.addField('블랙리스트 업데이트', `${targets.size}명의 유저를 블랙리스트에 ${type === 1 ? '추가' : '제거'}했어요.`)
    return { type: 'msg', aft: embed }
  }
}
