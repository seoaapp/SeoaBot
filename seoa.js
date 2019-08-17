/**
 * @name Seoa
 * @description Seoa - Music Player
 * @license GPL-3.0-or-later
 * @author Seoa Bot Develoment Team
 * @version 0.1.0
 */

'use strict' // strict mode

/** Custom Discord.js Module */
const Seoa = require('./classes/seoa')

/** Database Manager Module */
const Umysql = require('umysql')
const db = new Umysql('localhost', 'root', 'root', 'seoa')

/** Seoa Settings */
const config = require('./config')

/** Random Color Picker Module */
const randomHexColor = require('random-hex-color')

/** Seoa Custom Discord Client */
const seoa = new Seoa(config, db)

/** Command Load */
const commands = require(config.commands)
Object.keys(commands).forEach(k => {
  const command = commands[k]
  console.log(`${config.commands}/${k} loaded`)
  command.callSign.forEach(c => {
    seoa.commands.set(c, command)
  })
})

/** i18n (locale) */
const i18n = require('i18n')
i18n.configure({
  directory: './locales'
})

seoa.on('ready', () => {
  console.info(seoa.user.username + ' is now Online!\n')
  seoa.user.setActivity(config.activity, { type: 'PLAYING' })
  seoa.guilds.forEach((guild) => {
    db.update('serverdata', { owner: guild.ownerID }, { id: guild.id })
  })
})

seoa.on('message', async (msg) => {
  if (msg.author.bot) return
  if (!msg.guild) return msg.channel.send(i18n.__({ phrase: 'BotNotDM', locale: 'en' }, seoa.user.username))

  let user = await db.select('userdata', { id: msg.author.id })
  user = user[0]
  if (!user) {
    db.insert('userdata', { id: msg.author.id })
    user = { id: msg.author.id, lang: 'en', quizPoint: 0 }
  }

  let server = await db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  if (!server) {
    db.insert('serverdata', { id: msg.guild.id, owner: msg.guild.ownerID })
    server = { id: msg.guild.id, lang: 'en', owner: msg.guild.ownerID }
  }

  if (!msg.content.startsWith(config.prefix)) return // 레벨링 시스템 추가되면 제거될 예정
  console.info(msg.guild.name + '> ' + msg.author.username + '> ' + msg.content)

  if (msg.content === config.prefix) {
    // UpTime Caculator Start
    let totalSeconds = (seoa.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    // UpTime Caculator End
    const inline = true
    const botInfoEmbed = {
      title: i18n.__({ phrase: 'Info', locale: server.lang }, seoa.user.username),
      description: i18n.__({ phrase: 'From', locale: server.lang }, msg.author.username),
      thumbnail: { url: seoa.user.avatarURL },
      color: parseInt(randomHexColor().substring(1), 16),
      fields: [
        {
          name: '\u200B',
          value: '\u200B',
          inline
        },
        {
          name: i18n.__({ phrase: 'Name&Tag', locale: server.lang }, seoa.user.username),
          value: seoa.user.tag,
          inline
        },
        {
          name: i18n.__({ phrase: 'ID', locale: server.lang }, seoa.user.username),
          value: seoa.user.id,
          inline
        },
        {
          name: i18n.__({ phrase: 'CommandSize', locale: server.lang }, seoa.user.username),
          value: seoa.commands.size,
          inline
        },
        {
          name: i18n.__({ phrase: 'UsersSize', locale: server.lang }, seoa.user.username),
          value: seoa.users.size,
          inline
        },
        {
          name: i18n.__({ phrase: 'ChannelsSize', locale: server.lang }, seoa.user.username),
          value: seoa.channels.size,
          inline
        },
        {
          name: i18n.__({ phrase: 'ServersSize', locale: server.lang }, seoa.user.username),
          value: seoa.guilds.size,
          inline
        },
        {
          name: i18n.__({ phrase: 'BotDay', locale: server.lang }, seoa.user.username),
          value: seoa.user.createdAt,
          inline
        },
        {
          name: i18n.__({ phrase: 'UpdataDay', locale: server.lang }, seoa.user.username),
          value: seoa.readyAt,
          inline
        },
        {
          name: i18n.__({ phrase: 'UpTime', locale: server.lang }, seoa.user.username),
          value: i18n.__({ phrase: 'Time', locale: server.lang }, days, hours, minutes, seconds),
          inline
        },
        {
          name: i18n.__({ phrase: 'APIPING', locale: server.lang }, seoa.user.username),
          value: Math.round(seoa.ping),
          inline
        }
      ]
    }
    msg.channel.send({ embed: botInfoEmbed })
  } else {
    const query = {
      fullText: msg.content,
      message: msg.content.split(config.prefix)[1],
      command: msg.content.split(config.prefix)[1].split(' ')[0],
      args: msg.content.split(config.prefix)[1].split(' ').slice(1)
    }

    const runCommand = seoa.commands.get(query.command.toLowerCase())
    if (runCommand) runCommand.run(seoa, msg, query)
  }
})

/** @copyright (c) 2019. Seoa Development Team. all rights reserved. */
