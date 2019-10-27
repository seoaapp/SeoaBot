const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['eval', 'dev'], 'eval', 'eval')
  }

  run (msg, args, p) {
    // eslint-disable-next-line no-eval
    eval(args.splice(1)).join(' ')
  }
}
