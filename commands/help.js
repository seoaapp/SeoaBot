/**
 * @name Seoa:helps
 * @description Help Command 
 */

/** File System: File Reader */
const fileReader = require('fs')
const discord = require('discord.js')

exports.run = ((seoa, msg, settings) => {
  let help = new discord.RichEmbed()
  .addField('Seoa CommandBook', 'Prefix: =')
  .setDescription('이 봇은 베타입니다. 불안정하니 버그가 발생할경우 [이슈](https://github.com/ttakkku/SeoaBot/issues)에 알려주세요 \n **[봇 초대링크!](https://discordapp.com/oauth2/authorize?client_id=584692085614182440&permissions=8&scope=bot)**')

  fileReader.readdir(settings.commands, (err, files) => {
    if (err) console.error(err)
    files.forEach((v, i) => {
      let temp = require('../' + settings.commands + v).helps || { description: '인식되지 않음', uses: '인식되지 않음' } 
      if (temp) {
        help.addField(temp.description, temp.uses)
      }
    })
    msg.channel.send('DM으로 도움말을 보냈습니다!')
    msg.author.send(help, 'https://discord.gg/KNBGZU2')
  })
})

exports.callSign = ['help', 'Help', '도움', '도움말']
exports.helps = {
  description: "도움말을 보여줍니다",
  uses: "=help"
}
