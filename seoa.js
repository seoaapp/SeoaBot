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

/** File System: File Reader */
const fs = require('fs')

/** ServersData */
if (!fs.existsSync('./ServerData/')) {
  fs.mkdirSync('./ServerData')
  fs.writeFileSync('./ServerData/owners.json', '{}')
}
if (!fs.existsSync('./ServerData/servers.json')) {
  fs.writeFileSync('./ServerData/servers.json', '{}')
}

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
  servers: require('./ServerData/servers.json')
}
module.exports.settings = settings
// process.env.GOOGLE_APPLICATION_CREDENTIALS = './lib/Seoa-d5dd2ce1a3b1.json'
/** Seoa Discord Client */
const seoa = new discord.Client()

/** Seoa Commands Collection */
const commands = new discord.Collection()

/** Guild Onwers ID */
if (!fs.existsSync('./ServerData/owners.json')) {
  fs.writeFileSync('./ServerData/owners.json', '{}')
}
const owners = require('./ServerData/owners.json')

/** UserData */
if (!fs.existsSync('./UserData/')) {
  fs.mkdirSync('./UserData')
  fs.writeFileSync('./UserData/users.json', '{}')
}
if (!fs.existsSync('./UserData/users.json')) {
  fs.writeFileSync('./UserData/users.json', '{}')
}
const users = require('./UserData/users.json')

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
    owners[guild.id] = guild.ownerID
  })

  fs.writeFileSync('./ServerData/owners.json', JSON.stringify(owners, null, '  '))
  // register users
  seoa.users.forEach((user) => {
    if (!users[user.id] && user.id !== '1') {
      users[user.id] = {
        quizPoint: 0,
        name: user.tag
      }
    }
  })

  fs.writeFileSync('./UserData/users.json', JSON.stringify(users, null, '  '))

  seoa.guilds.forEach((guilds) => {
    if (!settings.servers[guilds.id] && guilds.id !== '1') {
      settings.servers[guilds.id] = {
        name: guilds.name,
        lang: 'en',
        channelnoticeid: ''
      }
    }
  })

  fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
})
seoa.on('guildCreate', () => {
  seoa.guilds.forEach((guild) => {
    owners[guild.id] = guild.ownerID
  })

  fs.writeFileSync('./ServerData/owners.json', JSON.stringify(owners, null, '  '))
  // register users
  seoa.users.forEach((user) => {
    if (!users[user.id] && user.id !== '1') {
      users[user.id] = {
        quizPoint: 0,
        name: user.tag
      }
    }
  })

  fs.writeFileSync('./UserData/users.json', JSON.stringify(users, null, '  '))

  seoa.guilds.forEach((guilds) => {
    if (!settings.servers[guilds.id] && guilds.id !== '1') {
      settings.servers[guilds.id] = {
        name: guilds.name,
        lang: 'en',
        channelnoticeid: ''
      }
    }
  })

  fs.writeFileSync('./ServerData/servers.json', JSON.stringify(settings.servers, null, '  '))
})

seoa.on('message', (msg) => {
  if (msg.author.id === seoa.user.id) return
  if (msg.author.bot) return
  if (!msg.guild) return// msg.channel.send(i18n.__({phrase: 'BotNotDM',locale: settings.servers[msg.guild.id].lang}, seoa.user.username))

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
      title: i18n.__({phrase: 'Info', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
      description: i18n.__({phrase: 'From', locale: settings.servers[msg.guild.id].lang}, msg.author.username),
      thumbnail: {
        url: seoa.user.avatarURL
      },
      color: parseInt(randomHexColor().substring(1), 16),
      fields: [
        {
          name: '\u200B',
          value: '\u200B',
          inline
        },
        {
          name: i18n.__({phrase: 'Name&Tag', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.user.tag,
          inline
        },
        {
          name: i18n.__({phrase: 'ID', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.user.id,
          inline
        },
        {
          name: i18n.__({phrase: 'CommandSize', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: commands.size,
          inline
        },
        {
          name: i18n.__({phrase: 'UsersSize', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.users.size,
          inline
        },
        {
          name: i18n.__({phrase: 'ChannelsSize', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.channels.size,
          inline
        },
        {
          name: i18n.__({phrase: 'ServersSize', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.guilds.size,
          inline
        },
        {
          name: i18n.__({phrase: 'BotDay', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.user.createdAt,
          inline
        },
        {
          name: i18n.__({phrase: 'UpdataDay',locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: seoa.readyAt,
          inline
        },
        {
          name: i18n.__({phrase: 'UpTime', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
          value: i18n.__({phrase: 'Time', locale: settings.servers[msg.guild.id].lang}, days, hours, minutes, seconds),
          inline
        },
        {
          name: i18n.__({phrase: 'APIPING', locale: settings.servers[msg.guild.id].lang}, seoa.user.username),
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
