const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['example'], 'example', 'example')
  }

  run (msg, args, p) {
    const embed = new p.Embed().setColor('RANDOM')
    return { type: 'msg', aft: embed } // or msg.channel.send(embed)
  }
}
