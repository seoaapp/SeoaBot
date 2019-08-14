/**
 * @name Seoa:Dev
 * @description Developer evaluation command
 */

/** Message */
const i18n = require('i18n')

exports.run = async (seoa, msg, settings, query) => {
  let server = await settings.db.select('serverdata', { id: msg.guild.id })[0]
  server = server[0]
  if (settings.owners.includes(msg.author.id)) {
    try {
      // eslint-disable-next-line
      eval(query.args.join(' '))
    } catch (error) {
      msg.channel.send(error)
    }
  } else {
    msg.channel.send(
      i18n.__({ phrase: '403', locale: server.lang })
    )
  }
}

exports.callSign = ['dev', 'eval']
