/**
 * @name Seoa:Dev
 * @description Developer evaluation command
 */

exports.run = ((seoa, msg, settings, query) => { 
  if (settings.owners.includes(msg.author.id)) {
    try {
      eval(query.args.join(' '))
    } catch (error) {
      msg.channel.send(error)
    }
  } else {
    msg.channel.send('어디서 감히 개발자도 아닌게 까불어!')
  }
})
exports.callSign = ['dev','eval']
