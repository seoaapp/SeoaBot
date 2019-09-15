/**
 * CommandModel
 * @class CommandModel
 */
class CommandModel {
  /**
   * @param {Array} alias 명령어 호출 방법 목록
   * @param {String} name 명령어 이름
   * @param {String} commandKey lang파일에서 도움말을 불러올때 쓰는 키 이름
   * @param {String | Number} perm 디스코드 권한
   * @param {Boolean} ownOnly 봇 소유자 전용 여부
   */
  constructor (alias, name, commandKey, perm, ownOnly) {
    this.alias = alias
    this.name = name
    this.key = commandKey
    this.perm = perm || 0
    this.ownOnly = ownOnly || false
  }

  /**
   * @param {Message} msg 디스코드 메시지
   * @param {Array} args 명령어 인수
   * @param {Object} p 디스코드 봇 구성요소
   */
  run (msg, args, p) {
    return { type: 'err', aft: `Not overrided in ${this.name} <= run[Method]` }
  }
}

module.exports = CommandModel
