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
if (!fs.existsSync('./ServerData/servers.json')) {
  fs.writeFileSync('./ServerData/servers.json', '{}')
}

/** Seoa Settings */
const settings = {
  token: process.env.token || '',
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
if (!fs.existsSync('./ServerData/')) {
  fs.mkdirSync('./ServerData')
  fs.writeFileSync('./ServerData/owners.json', '{}')
}
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

/** Message */
const locale = {
  en: require('./locales/en.json'),
  kor: require('./locales/kor.json'),
  pt: require('./locales/pt.json')
}
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

seoa.on('message', (msg) => {
  if (msg.author.id === seoa.user.id) return
  if (msg.author.bot) return
  if (!msg.guild) return msg.channel.send(locale[settings.servers[msg.guild.id].lang].BotNotDM.replace('[seoa.user.username]', seoa.user.username))

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
    const inline = true
    const botInfoEmbed = {
      title: locale[settings.servers[msg.guild.id].lang].Info.replace('[seoa.user.username]', seoa.user.username),
      description: msg.author + locale[settings.servers[msg.guild.id].lang].From.replace('[msg.author]', msg.author),
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
          name: locale[settings.servers[msg.guild.id].lang]['Name&Tag'].replace('[seoa.user.username]', seoa.user.username),
          value: seoa.user.tag,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].ID.replace('[seoa.user.username]', seoa.user.username),
          value: seoa.user.id,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].CommandSize,
          value: commands.size,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].UsersSize,
          value: seoa.users.size,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].ChannelsSize,
          value: seoa.channels.size,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].ServersSize,
          value: seoa.guilds.size,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].BotDay.replace('[seoa.user.username]', seoa.user.username),
          value: seoa.user.createdAt,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].UpdataDay.replace('[seoa.user.username]', seoa.user.username),
          value: seoa.readyAt,
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].UpTime.replace('[seoa.user.username]', seoa.user.username),
          value: locale[settings.servers[msg.guild.id].lang].Time.replace('[days]', days).replace('[hours]', hours).replace('[minutes]', minutes).replace('[seconds]', seconds),
          inline
        },
        {
          name: locale[settings.servers[msg.guild.id].lang].APIPING,
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
