/**
 * @name Seoa
 * @description Seoa - Music Player
 * @license GPL-3.0-or-later
 * @author Seoa Bot Develoment Team
 * @version 0.1.0
 */

'use strict' // strict mode

/** Discord.js Module */
const discord = require('discord.js')

/** Dialogflow Module */
const dialogflow = require('dialogflow')

/** Random Color Picker Module */
const randomHexColor = require('random-hex-color')

/** sangoon_is_math Module */
const SIM = require("sangoon_is_math") 

/** Seoa Settings */
const settings = {
  token: process.env.token || '',
  prefix: process.env.prefix || '~',
  commands: process.env.commands || './commands/',
  dialogflow: process.env.dialogflow || 'seoa-woksnl',
  activity: process.env.activity || 'Awesome Musics | ~help'
}

/** Seoa Discord Client */
const seoa = new discord.Client()

/** Seoa Dialogflow Client */
const seoaDialogflow = new dialogflow.SessionsClient()
  /** Seoa Commands Collection */
let commands = new discord.Collection()

// Command Reading Start

/** File System: File Reader */
const fileReader = require('fs')

fileReader.readdir(settings.commands, (err, files) => {
  if (err) console.err(err)

  let commandFiles = files.filter((v) => v.split('.').pop() === 'js')
  if (commandFiles.length <= 0) console.error('Couldn\'t find commands.')

  commandFiles.forEach((v, i) => {
  let command = require(settings.commands + v)
  command.callSign.forEach((sign) => {
  commands.set(sign, command)
  })
  console.log('Command Readed: ' + settings.commands + v)
  })
})

// Command Reading End

seoa.login(settings.token)

seoa.on('ready', () => {
  console.info(seoa.user.username + ' is now Online!\n')
  seoa.user.setActivity(settings.activity, { type: 'PLAYING' })
})

seoa.on('message', (msg) => {

  if (msg.author.id === seoa.user.id) return
  if (msg.author.bot) return 
  if (!msg.guild) return msg.channel.send(seoa.user.username + '는 DM에서 사용하실 수 없어요!')

  if (!msg.content.startsWith(settings.prefix)) return
  console.info(msg.author.username + '> ' + msg.content)
  if (msg.content === settings.prefix) {

    // UpTime Caculator Start
    let totalSeconds = (seoa.uptime / 1000)
    let days = Math.floor(totalSeconds / 86400)
    let hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = Math.floor(totalSeconds % 60)
    // UpTime Caculator End

    let botInfoEmbed = new discord.RichEmbed()
      .setTitle(seoa.user.username + '정보!')
      .setDescription(msg.author + '에게')
      .setThumbnail(seoa.user.avatarURL)
      .setColor(randomHexColor())
      .addBlankField()
      .addField(seoa.user.username + '의 이름, 태그', seoa.user.tag, true)
      .addField(seoa.user.username + '의 ID', seoa.user.id, true)
      .addField('총 명령어 수', commands.size, true)
      .addField('총 사용자 수', seoa.users.size, true)
      .addField('총 채널 수', seoa.channels.size, true)
      .addField('총 서버 수', seoa.guilds.size, true)
      .addField(seoa.user.username + '의 생일', seoa.user.createdAt, true)
      .addField(seoa.user.username + '의 업데이트 날짜', seoa.readyAt, true)
      .addField(seoa.user.username + '의 업타임', days + '일 ' + hours + '시간 ' + minutes + '분 ' + seconds + '초', true)
      .addField('API 핑', SIM.round(seoa.ping), true)
    msg.channel.send(botInfoEmbed)
  } else {
    let request = {
      session: seoaDialogflow.sessionPath(settings.dialogflow, msg.author.id),
      queryInput: {
        text: {
          text: msg.content.split(settings.prefix)[1],
          languageCode: 'ko-KR'
        }
      }
    }

    seoaDialogflow.detectIntent(request).then((res) => {
      if (res[0].queryResult.fulfillmentText.split(';')[0] === 'run') {
        if (commands.get(res[0].queryResult.fulfillmentText.split(';')[1])) commands.get(res[0].queryResult.fulfillmentText.split(';')[1]).run(seoa, msg, settings)
      } else if (res[0].queryResult.fulfillmentText.split(';')[0] === 'say') {
        msg.channel.send(res[0].queryResult.fulfillmentText.split(';')[1])
      }
    })
  }
})
  /** @copyright (c) 2019. Seoa Develoment Team. all rights reserved. */
