/**
 * EventModel
 * @class EventModel
 */
class EventModel {
  /**
   * @param {Client} client 디스코드 봇 클라이언트
   * @param {String} eventName 이벤트 이름
   */
  constructor (client, eventName) {
    this.client = client
    this.eventName = eventName
    client.on(eventName, this.run)
  }

  run () {
    throw new SyntaxError(`Not overrided in ${this.eventName} <= run[Method]`)
  }
}

module.exports = EventModel
