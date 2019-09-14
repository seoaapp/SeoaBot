const { Client } = require('discord.js')
const UlangTS = require('ulangts')
const UmusicTS = require('umusicts')
const Umysql = require('umysql')

class Seoa extends Client {
  constructor (config) {
    super()
    this.config = UlangTS.parse(config, config)
    this.classes = require(this.config.path.classes)
    this.events = require(this.config.path.events)
    this.commands = new Map()
    this.commandsOrigin = require(this.config.path.commands)
    
    this.langs = new UlangTS(require(this.config.path.languages))
    this.m = new UmusicTS()
    this.search = this.classes.search && this.config.api.youtube.enable ?
      new this.classes.search(this.config.api.youtube.clientID).addParam('type', 'video').addParam('order', 'relevance') :
      false
    this.db = this.config.mysql.enable ?
      new Umysql(this.config.mysql.host, this.config.mysql.user, this.config.mysql.pass, this.config.mysql.database, this.config.mysql.port, this.config.mysql.charset):
      null
    this.gi = this.db ? new this.classes.getinf(this.db, 'userdata', 'serverdata', 'mylist') : null

    Object.values(this.events).forEach(_ => new _(this))
    Object.values(this.commandsOrigin).forEach(_ => {
      const command = new _()
      command.alias.forEach(alia => {
        this.commands.set(alia, command)
      })
    })
    
    this.login(this.config.token)
  }

  dummy () {
    return true
  }
}

module.exports = Seoa
