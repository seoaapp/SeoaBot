const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['ping', 'pong'], 'ping', 'ping')
  }

  run (msg, args, p) {
    const embed = new p.Embed().setColor('RANDOM')
    const ping = Math.abs(new Date() - msg.createdTimestamp)
    embed.addField('Pong!', p.lang.get('ping', [ping, p.client.ping]))
    msg.channel.send(embed)
  }
}
