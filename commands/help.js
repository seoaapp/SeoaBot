/**
 * @name Seoa:helps
 * @description Help Command
 */

/** File System: File Reader */
const fileReader = require('fs')
const { resolve: pathAppend } = require('path')

exports.run = (seoa, msg, settings) => {
  const help = {
    fields: [
      {
        name: 'Seoa CommandBook',
        value: 'Prefix: >'
      }
    ],
    description: '이 봇은 베타입니다. 불안정하니 버그가 발생할경우 [이슈](https://github.com/ttakkku/SeoaBot/issues)에 알려주세요 \n **[봇 초대링크!](https://discordapp.com/oauth2/authorize?client_id=584692085614182440&permissions=8&scope=bot)** \n **[봇 서포트 주소](https://discord.gg/QJfeKYr)**'
  }

  fileReader.readdir(settings.commands, (err, files) => {
    if (err) console.error(err)
    files.forEach((v) => {
      const temp = require(pathAppend(__dirname, '../', settings.commands, v)).helps
      const inline = true
      if (temp) {
        help.fields.push({
          name: temp.description,
          value: '> ' + temp.uses,
          inline
        })
      }
    })
    msg.channel.send('DM으로 도움말을 보냈습니다!')
    msg.author.send({ embed: help })
  })
}

exports.callSign = ['help', 'Help', '도움', '도움말']
exports.helps = {
  description: '도움말을 보여줍니다',
  uses: '>help'
}
