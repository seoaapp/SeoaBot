class EventModel {
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
