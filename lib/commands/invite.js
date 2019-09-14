const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['invite', '초대링크', '봇초대링크'], 'invite', 'invite')
  }

  run (msg, args, p) {
    const embed = new p.Embed().setColor('RANDOM')
    embed.setDescription(p.lang.get('Invite'))
    return { type: 'msg', aft: embed }
  }
}
