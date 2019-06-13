/**
 * @name Seoa:Invite
 * @description Bot Invite Command 
 */


const discord = require('discord.js')

exports.run = (seoa, msg) => {
  let Invite = new discord.RichEmbed()
  .setDescription('**[봇 초대링크!](https://discordapp.com/oauth2/authorize?client_id=584692085614182440&permissions=8&scope=bot)**')
   msg.channel.send(Invite)
}
exports.callSign = ['invite', '봇초대링크', '초대링크', 'Invite']
exports.helps = {
  description: "초대링크를 줍니다",
  uses: "~invite"
}
