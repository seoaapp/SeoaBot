const Model = require('./model')
const unique = require('uuniquets')
module.exports = class extends Model {
  constructor () {
    super(['help', '도움', '도움말'], 'help', 'help')
  }

  run (msg, args, p) {
    const prefix = p.client.config.prefix
    const commands = unique([...p.client.commands.values()])
    const embed = new p.Embed().setTitle(p.lang.get('CommandBook'))
      .setDescription(p.lang.get('Prefix', [prefix]))

    for (const c of commands) {
      if (c.ownOnly ? !p.client.is(1, msg.member) : !p.client.is(2, msg.member, c.perm)) continue
      const uses = prefix + c.alias.join(`, ${prefix}`)
      embed.addField(p.lang.get(`cmd_${c.key}_desc`), uses, true)
    }

    return { type: 'msg', aft: embed, target: msg.author }
  }
}
