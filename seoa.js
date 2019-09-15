const { Client } = require('discord.js')
const UlangTS = require('ulangts')
const UmusicTS = require('umusicts')
const UmulavaTS = require('umulavats')
const Umysql = require('umysql')
const path = require('path')

class Seoa extends Client {
  constructor (config) {
    super()
    /** 봇 환경변수 불러오기 및 해석 */
    this.config = UlangTS.parse(config, config)
    this.loadKeys = ['classes', 'events', 'commandsOrigin']
    /** 커맨드 & 클래스 & 이벤트 (리)로드 함수 */
    this.load()

    /** 언어 해석 모듈 (건들지 마시오) */
    this.langs = new UlangTS(require(this.config.path.languages))
    /** 음악 모듈 (건들지 마시오) */
    this.m = this.config.music.useNative ? new UmusicTS() : new UmulavaTS(this)
    /** 유튜브 영상 검색 모듈 (건들지 마시오) */
    this.search = this.classes.Search && this.config.api.youtube.enable
      ? new this.classes.Search(this.config.api.youtube.clientID).addParam('type', 'video').addParam('order', 'relevance')
      : false
    /** 데이터베이스 휘젓는 모듈 (건들지 마시오) */
    this.db = this.config.mysql.enable
      ? new Umysql(this.config.mysql.host, this.config.mysql.user, this.config.mysql.pass, this.config.mysql.database, this.config.mysql.port, this.config.mysql.charset)
      : null
    /** 사용자 정보 & 길드 정보 & 마이리스트 정보 불러오는 모듈 (입맛대로 고쳐쓰셈)) */
    this.gi = this.db && this.classes.GetInf ? new this.classes.GetInf(this.db, 'userdata', 'serverdata', 'mylist') : null
    this.login(this.config.token)
  }

  load (loadKeys) {
    (loadKeys || this.loadKeys).forEach(lK => {
      /** 모듈 리로드를 위해 캐시 제거 */
      delete require.cache[path.resolve(this.config.path[lK], './index.js')]
      const temp = require(this.config.path[lK])
      /** 모듈 리로드를 위해 캐시 제거 */
      Object.keys(temp).forEach(k => { delete require.cache[path.resolve(this.config.path[lK], `./${k}.js`)] })
      this[lK] = require(this.config.path[lK])
    })

    /** 커맨드 초기화 */
    this.commands = new Map()
    /** 기존에 할당 된 이벤트 초기화 및 새로운 이벤트 할당 */
    Object.values(this.removeAllListeners().events).forEach(_ => new _(this))
    /** 커맨드 할당 */
    Object.values(this.commandsOrigin).forEach(_ => {
      const command = new _()
      command.alias.forEach(alia => {
        this.commands.set(alia, command)
      })
    })
  }
}

module.exports = Seoa
