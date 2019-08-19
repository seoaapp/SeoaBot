/**
 * @name Seoa:Dev
 * @description Developer evaluation command
 */

/** Message */
const i18n = require('i18n')

/** 제한 */
const unObfuscate = require('./stuffs/unObfuscate')
const risks = ['Infinity', 'delete', 'Obfuscate', 'risks', 'policy', 'setInterval', 'fs', 'require', 'eval', '\'+', '+\'', '"+', '+"', '`+', '+`', 'token', 'Function', 'exit', 'pid', 'kill', 'Buffer', 'proto', 'debugger' ]
const classes = ['Math', 'zlib', 'while', 'with', 'Timeout', 'decoder', 'encoder', 'stream', 'switch', 'root', 'repl', 'readline', 'tty', 'tls', 'finally', 'catch', 'try', 'this', 'querystring', 'Enumerable', 'path', 'Int', 'Float', 'os', 'net', 'new', 'module', 'Of', 'spector', 'of', 'in', 'import', 'if', 'https', 'http2', 'http', 'Property', 'function', 'for', 'true', 'false', 'events', 'eval', 'escape', 'export', 'exports', 'dgram', 'domain', 'dns', 'component', 'do', 'delete', 'default', 'constructor', 'Immediate', 'Interval', 'console', 'buffer', 'process', 'assert', 'Array', 'Buffer', 'Atomics', 'BigInt', 'Boolean', 'REQUEST', 'RESPONSE', 'END', 'CONNECTION', 'View', 'Date', 'Error', 'Function', 'GLOBAL', 'Intl', 'JSON', 'Map', 'NaN', 'Number', 'Object', 'Promise', 'Proxy', 'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'URL', 'Params', 'Assembly']
classes.forEach(c => {
  risks.push(`${c}=`)
})

exports.run = async (seoa, msg, query) => {
  let policy = seoa.settings.localPolicy.eval
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  try {
    let q = query.args.join(' ')
    if (unObfuscate.detect(q)) {
      if (!policy.acceptObfuscate) return msg.channel.send('보안 정책상 난독화된 코드를 사용할 수 없습니다.')
      if (policy.decryptObfuscate) q = unObfuscate.unpack(q)
    }
    if (policy.disableRisks) return eval(q)
    for (let i = 0; i < risks.length; i++) {
      if (q.split(' ').join('').includes(risks[i])) return msg.channel.send(`보안 정책상 봇 구동에 영향이 가는 코드(${policy.sayFindedRisk ? risks[i]: '보안 정책으로 비공개'})를 사용할 수 없습니다.`)
      if (i === risks.length - 1) eval(q)
    }
  } catch (e) {
    msg.channel.send(policy.sayError ? e.toString() : '보안 정책상 에러를 표시하지 않습니다.')
  }
}

exports.callSign = ['dev', 'eval']
exports.helps = {
  chkOwner: true
}