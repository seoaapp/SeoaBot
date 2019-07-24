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
// const dialogflow = require('dialogflow')

/** Random Color Picker Module */
const randomHexColor = require('random-hex-color')

/** sangoon_is_math Module */
const SIM = require('sangoon_is_math')

/** Seoa Settings */
const settings = {
  token: process.env.token || '',
  prefix: process.env.prefix || '>',
  commands: process.env.commands || './commands/',
  dialogflow: process.env.dialogflow || 'seoa-woksnl',
  activity: process.env.activity || 'Awesome Musics | >help',
  owners: ['527746745073926145', '309230935377707011']
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = './lib/Seoa-d5dd2ce1a3b1.json'

/** Seoa Discord Client */
const seoa = new discord.Client()

/** Seoa Commands Collection */
const commands = new discord.Collection()

// Command Reading Start

/** File System: File Reader */
const fileReader = require('fs')

fileReader.readdir(settings.commands, (err, files) => {
  if (err) console.err(err)

  const commandFiles = files.filter((v) => v.split('.').pop() === 'js')
  if (commandFiles.length <= 0) console.error('Couldn\'t find commands.')

  commandFiles.forEach((v, i) => {
    const command = require(settings.commands + v)
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
  console.info(msg.guild.name + '> ' + msg.author.username + '> ' + msg.content)

  if (msg.content === settings.prefix) {
    // UpTime Caculator Start
    let totalSeconds = (seoa.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    // UpTime Caculator End

    const botInfoEmbed = new discord.RichEmbed()
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
    const query = {
      fullText: msg.content,
      message: msg.content.split(settings.prefix)[1],
      command: msg.content.split(settings.prefix)[1].split(' ')[0],
      args: msg.content.split(settings.prefix)[1].split(' ').slice(1)
    }

    const runCommand = commands.get(query.command)

    if (!runCommand) {
      runCommand.run(seoa, msg, settings, query)
    }
  }
})

/** @copyright (c) 2019. Seoa Develoment Team. all rights reserved. */
