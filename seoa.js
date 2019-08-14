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

/** Database manager module */
const Umysql = require('umysql')
const db = new Umysql('localhost', 'root', 'root', 'seoa')

/** Dialogflow Module */
// const dialogflow = require('dialogflow')

/** Random Color Picker Module */
const randomHexColor = require('random-hex-color')

/** sangoon_is_math Module */
const SIM = require('sangoon_is_math')

/** File System: File Reader */
const fs = require('fs')

/** Seoa Settings */
const settings = {
  token: process.env.token || process.argv[2] || '',
  prefix: process.env.prefix || '>',
  commands: process.env.commands || './commands/',
  // dialogflow: process.env.dialogflow || 'seoa-woksnl',
  activity: process.env.activity || 'Awesome Musics & Quizs | >help',
  owners: ['527746745073926145', '309230935377707011', '403025222921486338',
    '487912605273423883', '526958314647453706', '119550317003014144',
    '393674169243402240'],
  db: db
}
module.exports.settings = settings
// process.env.GOOGLE_APPLICATION_CREDENTIALS = './lib/Seoa-d5dd2ce1a3b1.json'
/** Seoa Discord Client */
const seoa = new discord.Client()

/** Seoa Commands Collection */
const commands = new discord.Collection()

// Command Reading Start

fs.readdir(settings.commands, (err, files) => {
  if (err) console.err(err)

  const commandFiles = files.filter((v) => v.split('.').pop() === 'js')
  if (commandFiles.length <= 0) console.error('Couldn\'t find commands.')

  commandFiles.forEach((v) => {
    const command = require(settings.commands + v)
    command.callSign.forEach((sign) => {
      commands.set(sign, command)
    })
    console.log('Command Readed: ' + settings.commands + v)
  })
})

// Command Reading End

// i18n (locale)
const i18n = require('i18n')
i18n.configure({
  directory: './locales'
})

// login
seoa.login(settings.token)

seoa.on('ready', () => {
  console.info(seoa.user.username + ' is now Online!\n')
  seoa.user.setActivity(settings.activity, { type: 'PLAYING' })

  seoa.guilds.forEach((guild) => {
    db.update('serverdata', { owner: guild.ownerID }, { id: guild.id })
  })
})
seoa.on('guildCreate', (server) => {
  const embed = new discord.RichEmbed()
    .setTitle('새로운 서버!')
    .setDescription(server.name)
    .setColor('#b8fff9')
  seoa.guilds.get('558296123794653206').channels.get('610635643546239006').send(embed)
})

seoa.on('message', async (msg) => {
  if (msg.author.bot) return
  if (!msg.guild) return msg.channel.send(i18n.__({ phrase: 'BotNotDM', locale: 'en' }, seoa.user.username)) // 임시적으로 영어로 출력

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

  if (!msg.content.startsWith(settings.prefix)) return
  console.info(msg.guild.name + '> ' + msg.author.username + '> ' + msg.content)

  if (msg.content === settings.prefix) {
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
          value: commands.size,
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
          value: SIM.round(seoa.ping),
          inline
        }
      ]
    }
    msg.channel.send({ embed: botInfoEmbed })
  } else {
    const query = {
      fullText: msg.content,
      message: msg.content.split(settings.prefix)[1],
      command: msg.content.split(settings.prefix)[1].split(' ')[0],
      args: msg.content.split(settings.prefix)[1].split(' ').slice(1)
    }

    const runCommand = commands.get(query.command.toLowerCase())

    if (!runCommand) {
      // msg.channel.send(locale[servers[msg.guild.id].lang].CommandNotFound)
    } else {
      runCommand.run(seoa, msg, settings, query)
    }
  }
})

/** @copyright (c) 2019. Seoa Development Team. all rights reserved. */
