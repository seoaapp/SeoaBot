const { Client } = require('discord.js')
const UlangTS = require('ulangts')
const UmusicTS = require('umusicts')
const Umysql = require('umysql')
class Seoa extends Client {
  constructor (config) {
    super()
    this.config = UlangTS.parse(config, config)
    this.commandsOrigin = require(this.config.path.commands)
    this.commands = new Map()
    this.events = require(this.config.path.events)
    this.db = new Umysql(this.config.mysql.host, this.config.mysql.user, this.config.mysql.pass, this.config.mysql.database, this.config.mysql.port, this.config.mysql.charset)
    this.langs = new UlangTS(require(this.config.path.languages))
    this.m = new UmusicTS()

    Object.values(this.commandsOrigin).forEach(_ => {
      const command = new _()
      command.alias.forEach(alia => {
        this.commands.set(alia, command)
      })
    })

    Object.values(this.events).forEach(_ => new _(this))
    this.login(this.config.token)
  }

  dummy () {
    return true
  }
}

module.exports = Seoa
