class CommandModel {
  constructor (alias, name, commandKey, perm, ownOnly) {
    this.alias = alias
    this.name = name
    this.key = commandKey
    this.perm = perm || 0
    this.ownOnly = ownOnly || false
  }

  run () {
    return { type: 'err', aft: `Not overrided in ${this.name} <= run[Method]` }
  }
}

module.exports = CommandModel
