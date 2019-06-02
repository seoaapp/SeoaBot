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

/** Seoa Settings */
const settings = {
    token: process.env.token || '',
    prefix: process.env.prefix || '=',
    commands: process.env.commands || './commands/',
    dialogflow: process.env.dialogflow || 'seoa-woksnl',
    activity: process.env.activity || 'Awesome Musics | =help',
    notGuildMsg: process.env.notGuildMsg || 'You cannot use SeoaBot in DM'
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
        readCommand.callSign.forEach((sign) => {
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
        if (!msg.guild) return msg.channel.send(settings.notGuildMsg)

        if (!msg.content.startsWith(settings.prefix)) return
        console.info(msg.author.username + '> ' + msg.content)

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
                if (commands.get(res[0].queryResult.fulfillmentText.split(';')[1])) commands.get(res[0].queryResult.fulfillmentText.split(';')[1]).run(seoa, msg)
            } else if (res[0].queryResult.fulfillmentText.split(';')[0] === 'say') {
                msg.channel.send(res[0].queryResult.fulfillmentText.split(';')[1])
            }
        })
    })
    /** @copyright (c) 2019. Seoa Bot Develoment Team. all rights reserved. */