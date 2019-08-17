/**
 * @name Seoa:helps
 * @description Help Command
 */

const commands = require('./')
const locale = {
  en: require('../locales/en.json'),
  kor: require('../locales/kor.json'),
  pt: require('../locales/pt.json')
}

exports.run = async (seoa, msg) => {
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  const help = {
    fields: [
      {
        name: locale[server.lang].CommandBook,
        value: locale[server.lang].Prefix + ' >'
      }
    ],
    description: locale[server.lang].BETAMSG
  }

  let keys = Object.keys(commands)
  for (k of keys) {
    if (commands[k].helps) help.fields.push({
      name: commands[k].helps.description,
      value: '> ' + commands[k].helps.uses,
      inline: true
    })

    if (keys.length === keys.indexOf(k) + 1) {
      msg.channel.send(locale[server.lang].DMSEND)
      msg.author.send({ embed: help })
    }
  }
}

exports.callSign = ['help', 'Help', '도움', '도움말']
exports.helps = {
  description: '도움말을 보여줍니다',
  uses: 'help'
}
