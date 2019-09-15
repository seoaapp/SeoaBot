const { Client } = require('discord.js')
const UlangTS = require('ulangts')
const UmusicTS = require('umusicts')
const UmulavaTS = require('umulavats')
const Umysql = require('umysql')
const path = require('path')

class Seoa extends Client {
  constructor (config) {
    super()
    this.config = UlangTS.parse(config, config)
    this.loadKeys = ['classes', 'events', 'commandsOrigin']
    this.load()

    this.langs = new UlangTS(require(this.config.path.languages))
    this.m = this.config.music.useNative ? new UmusicTS() : new UmulavaTS(this)
    this.search = this.classes.Search && this.config.api.youtube.enable
      ? new this.classes.Search(this.config.api.youtube.clientID).addParam('type', 'video').addParam('order', 'relevance')
      : false
    this.db = this.config.mysql.enable
      ? new Umysql(this.config.mysql.host, this.config.mysql.user, this.config.mysql.pass, this.config.mysql.database, this.config.mysql.port, this.config.mysql.charset)
      : null
    this.gi = this.db && this.classes.GetInf ? new this.classes.GetInf(this.db, 'userdata', 'serverdata', 'mylist') : null
    this.login(this.config.token)
  }

  load (loadKeys) {
    (loadKeys || this.loadKeys).forEach(lK => {
      delete require.cache[path.resolve(this.config.path[lK], './index.js')]
      const temp = require(this.config.path[lK])
      Object.keys(temp).forEach(k => {
        const p = path.resolve(this.config.path[lK], `./${k}.js`)
        delete require.cache[p]
      })
      this[lK] = require(this.config.path[lK])
    })

    this.commands = new Map()
    Object.values(this.removeAllListeners().events).forEach(_ => new _(this))
    Object.values(this.commandsOrigin).forEach(_ => {
      const command = new _()
      command.alias.forEach(alia => {
        this.commands.set(alia, command)
      })
    })
  }
}

module.exports = Seoa
