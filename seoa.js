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
  // dialogflow: process.env.dialogflow || 'seoa-woksnl',
  activity: process.env.activity || 'Awesome Musics | >help',
  owners: ['527746745073926145', '309230935377707011']
}
module.exports.settings = settings
// process.env.GOOGLE_APPLICATION_CREDENTIALS = './lib/Seoa-d5dd2ce1a3b1.json'
/** Seoa Discord Client */
const seoa = new discord.Client()

/** Seoa Commands Collection */
const commands = new discord.Collection()

/** Guild Onwers ID */
const owners = require('./ServerData/owner.json')

/** UserData */
const users = require('./UserData/users.json')

/** Message */
const locale = require('./locales/kr.json')
// Command Reading Start

/** File System: File Reader */
const fs = require('fs')

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

  fs.writeFileSync('./ServerData/owner.json', JSON.stringify(owners, null, '  '))
  // register users
  seoa.users.forEach((user) => {
    if (!users[user.id] && user.id !== '1') {
      users[user.id] = {
        quizPoint: 0
      }
    }
  })

  fs.writeFileSync('./UserData/users.json', JSON.stringify(users, null, '  '))
})

seoa.on('message', (msg) => {
  if (msg.author.id === seoa.user.id) return
  if (msg.author.bot) return
  if (!msg.guild) return msg.channel.send(locale.BotNotDM.replace('[seoa.user.username]', seoa.user.username))

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
      title: seoa.user.username + locale.Info,
      description: msg.author + locale.From,
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
          name: seoa.user.username + locale['Name&Tag'],
          value: seoa.user.tag,
          inline
        },
        {
          name: seoa.user.username + locale.ID,
          value: seoa.user.id,
          inline
        },
        {
          name: locale.CommandSize,
          value: commands.size,
          inline
        },
        {
          name: locale.UsersSize,
          value: seoa.users.size,
          inline
        },
        {
          name: locale.ChannelsSize,
          value: seoa.channels.size,
          inline
        },
        {
          name: locale.ServersSize,
          value: seoa.guilds.size,
          inline
        },
        {
          name: seoa.user.username + locale.BotDay,
          value: seoa.user.createdAt,
          inline
        },
        {
          name: seoa.user.username + locale.UpdataDay,
          value: seoa.readyAt,
          inline
        },
        {
          name: seoa.user.username + locale.UpTime,
          value: days + locale.Day + hours + locale.hour + minutes + locale.minute + seconds + locale.second,
          inline
        },
        {
          name: locale.APIPING,
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
      msg.channel.send(locale.CommandNotFound)
    } else {
      runCommand.run(seoa, msg, settings, query)
    }
  }
})

/** @copyright (c) 2019. Seoa Development Team. all rights reserved. */
