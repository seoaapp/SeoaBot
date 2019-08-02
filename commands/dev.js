/**
 * @name Seoa:Dev
 * @description Developer evaluation command
 */

/** Message */
const i18n = require('i18n')

exports.run = (seoa, msg, settings, query) => {
  if (settings.owners.includes(msg.author.id)) {
    try {
      // eslint-disable-next-line
      eval(query.args.join(' '))
    } catch (error) {
      msg.channel.send(error)
    }
  } else {
    msg.channel.send(
      i18n.__({ phrase: '403', locale: settings.servers[msg.guild.id].lang })
    )
  }
}

exports.callSign = ['dev', 'eval']
