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

/** Seoa Settings */
const config = require('./config')

/** Database Manager Module */
const Umysql = require('umysql')
const db = new Umysql(config.mysql.host, config.mysql.user, config.mysql.pass, config.mysql.database, config.mysql.port)

/** Seoa Custom Discord Client */
const seoa = new Seoa(config, db)

/** i18n (locale) */
const i18n = require('i18n')
i18n.configure({
  directory: config.locales
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

  if (!msg.content.startsWith(config.prefix)) return
  console.info(msg.guild.name + '> ' + msg.author.username + '> ' + msg.content)
  const query = {
    fullText: msg.content,
    message: msg.content.split(config.prefix)[1],
    command: msg.content.split(config.prefix)[1].split(' ')[0],
    args: msg.content.split(config.prefix)[1].split(' ').slice(1)
  }

  const cmd = seoa.commands.get(query.command.toLowerCase())
  if (!cmd) return
  let pass = cmd.helps && (cmd.helps.chkOwner || cmd.helps.permission) ?
    (
      cmd.helps.chkOwner ?
      config.owners.includes(msg.author.id) || '403' :
      config.owners.includes(msg.author.id) || msg.member.hasPermission(cmd.helps.permission) || 'MISS'
    ) : true
  if ((typeof pass) === 'boolean' && pass) cmd.run(seoa, msg, query)
  else if ((typeof pass) === 'string') msg.channel.send(i18n.__({ phrase: pass, locale: server.lang }))
})

/** @copyright (c) 2019. Seoa Development Team. all rights reserved. */
