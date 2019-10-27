const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['set', 'setting', '설정', 'settings'], 'setting', 'setting', 8)
  }

  run (msg, args, p) {
    const embed = new p.Embed()
    if (args[1] === 'prefix') {
      if (!args[2]) return
      const before = p.g.prefix
      p.db.update('serverData', { prefix: args[2] }, { id: msg.guild.id })
      embed.addField('Prefix 변경', `Prefix가 ${before}에서 ${args[2]}로 변경되었습니다!`)
    }
    return { type: 'msg', aft: embed }
  }
}
