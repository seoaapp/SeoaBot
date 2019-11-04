const Model = require('./model')
const allowLangs = ['ko', 'en']
module.exports = class extends Model {
  constructor () {
    super(['set', 'setting', '설정', 'settings'], 'setting', 'setting')
  }

  run (msg, args, p) {
    const embed = new p.Embed()
    if (args[1] === 'prefix') {
      if (msg.member.hasPermission(8) || !args[2]) return
      const before = p.g.prefix
      p.db.update('serverData', { prefix: args[2] }, { id: msg.guild.id })
      embed.addField('Prefix 변경', `Prefix가 ${before}에서 ${args[2]}로 변경되었습니다!`)
    } else if (args[1] === 'lang') {
      if (!allowLangs.includes(args[2])) {
        embed.addField('언어 변경', `지원하는 언어가 아닙니다.\n\`\`${allowLangs.join(', ')}\`\` 만 지원합니다.`)
      } else {
        const before = p.u.lang
        p.db.update('serverData', { prefix: args[2] }, { id: msg.guild.id })
        embed.addField('언어 변경', `언어가 ${before}에서 ${args[2]}로 변경되었습니다!`)
      }
    }
    return { type: 'msg', aft: embed }
  }
}
