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

/** Message */
const locale = require('./locales/kr.json')

// Command Reading Start

/** File System: File Reader */
const fs = require('fs')

fs.readdir(settings.commands, (err, files) => {
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

  seoa.guilds.forEach((guild) => {
    owners[guild.id] = guild.owner.id
  })

  fs.writeFileSync('./ServerData/owner.json', JSON.stringify(owners))
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

    const botInfoEmbed = new discord.RichEmbed()
      .setTitle(seoa.user.username + locale.Info)
      .setDescription(msg.author + locale.From)
      .setThumbnail(seoa.user.avatarURL)
      .setColor(randomHexColor())
      .addBlankField()
      .addField(seoa.user.username + locale['Name&Tag'], seoa.user.tag, true)
      .addField(seoa.user.username + locale.ID, seoa.user.id, true)
      .addField(locale.CommandSize, commands.size, true)
      .addField(locale.UsersSize, seoa.users.size, true)
      .addField(locale.ChannelsSize, seoa.channels.size, true)
      .addField(locale.ServersSize, seoa.guilds.size, true)
      .addField(seoa.user.username + locale.BotDay, seoa.user.createdAt, true)
      .addField(seoa.user.username + locale.UpdataDay, seoa.readyAt, true)
      .addField(seoa.user.username + locale.UpTime, days + locale.Day + hours + locale.hour + minutes + locale.minute + seconds + locale.second, true)
      .addField(locale.APIPING, SIM.round(seoa.ping), true)
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
      msg.channel.send(locale.CommandNotFound)
    } else {
      runCommand.run(seoa, msg, settings, query)
    }
  }
})

/** @copyright (c) 2019. Seoa Develoment Team. all rights reserved. */

/**
 * 으아아아악
 * 으아아아아아아아악
 * 심심해!
 * 으아아아아아악
 * 으아아아아아ㅏㅇ아ㅏㅇ아아ㅏㅇ
 * 뭐하지 뭐하지
 * 으아아아
 * simsim
 * tlatla
 * i am simsim and you also
 * 심시밋미심시밋ㅁ
 * 으아아아 심심
 * 뭐하지뭐하지뭐하지
 * anjgkwlanjgkwl
 */
