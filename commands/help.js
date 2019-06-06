/**
 * @name Seoa:helps
 * @description Help Command 
 */
const discord = require('discord.js')

exports.run = ((seoa, msg) => {
  let help = new discord.RichEmbed()
  .addField('Seoa CommandBook', 'Prefix: =')
  .addField('Help (CommandBook)', '=help / =도움 / =도움말')
  .addField('search (CommandBook)', '=search / =검색')
  .addField('와! 심심해!', '=[할말]')
  .setDescription('이 봇은 베타입니다. 불안정하니 버그가 발생할경우 [이슈](https://github.com/ttakkku/SeoaBot/issues)에 알려주세요')

  msg.channel.send('DM으로 도움말을 보냈습니다!')
  msg.author.send(help)
})

exports.callSign = ['help', 'Help', '도움', '도움말']
