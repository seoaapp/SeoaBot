const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['reload', '리로드'], 'reload', 'reload', 0, true)
  }

  run (msg, args, p) {
    const embed = new p.Embed()
    p.client.load()
    embed.setDescription(`${p.client.commands.size}개의 명령어\n${Object.keys(p.client.events).length}개의 이벤트\n${Object.keys(p.client.classes).length}개의 클래스 로드가 완료되었습니다.`)
    return { type: 'msg', aft: embed }
  }
}
