class CommandModel {
  constructor (alias, name, commandKey) {
    this.alias = alias
    this.name = name
    this.key = commandKey
  }

  run () {
    throw new SyntaxError(`Not overrided in ${this.name} <= run[Method]`)
  }
}

module.exports = CommandModel
