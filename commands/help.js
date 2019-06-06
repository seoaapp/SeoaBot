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
<<<<<<< HEAD
=======
  .addField('Help (CommandBook)', '=help / =도움 / =도움말')
  .addField('search (CommandBook)', '=search / =검색')
  .addField('와! 심심해!', '=[할말]')
>>>>>>> 3b70316f8d53a9656a612e612dafe894e6b68935
  .setDescription('이 봇은 베타입니다. 불안정하니 버그가 발생할경우 [이슈](https://github.com/ttakkku/SeoaBot/issues)에 알려주세요')


  fileReader.readdir(settings.commands, (err, files) => {
    if (err) console.error(err)
    files.forEach((v, i) => {
      let temp = require(settings.commands + v).helps || null
      if (temp) {
        help.addField(temp.description, temp.uses)
      }
    })
  })

  msg.channel.send('DM으로 도움말을 보냈습니다!')
  msg.author.send(help)
})

exports.callSign = ['help', 'Help', '도움', '도움말']
exports.helps = {
  description: "도움말을 보여줍니다",
  uses: "=help"
}
