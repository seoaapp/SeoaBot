/**
 * GetInfos
 * @class GetInfos
 * @author UnderC
 */
class GetInfos {
  /**
   * @param {DB} db umysql 모듈로 만들어진 DB 커넥션
   * @param {String} userTable user 정보가 들어있는 테이블 이름
   * @param {String} serverTable guild 정보가 들어있는 테이블 이름
   * @param {String} myListTable 마이리스트 정보가 들어있는 테이블 이름
   */
  constructor (db, userTable, serverTable, myListTable) {
    if (!db) throw new Error()
    this.db = db
    this.u = userTable
    this.s = serverTable
    this.m = myListTable
  }

  /**
   * @param {String} table 테이블 이름
   * @param {Object} a 찾으려는 데이터
   * @param {Object} b 찾지 못하면 삽입할 데이터
   * @param {Boolean} assignBoth a와 b를 병합해서 삽입할 지 여부
   */
  async getIns (table, a, b, assignBoth) {
    const dat = await this.db.select(table, a)
    if (!dat) throw new Error()
    else if (!dat[0]) {
      this.db.insert(table, b ? (assignBoth ? a.assign(b) : b) : a)
      return this.getIns(table, a)
    }

    return dat[0]
  }

  /**
   * @param {String} u 찾으려는 user의 아이디
   * @returns {Object} user의 정보
   */
  getUser (u) {
    return this.getIns(this.u, { id: u.id })
  }

  /**
   * @param {String} s 찾으려는 guild의 아이디
   * @returns {Object} guild의 정보
   */
  getGuild (s) {
    return this.getIns(this.s, { id: s.id }, { owner: s.ownerID }, true)
  }

  /**
   * @param {String} n 찾으려는 마이리스트 이름
   * @returns {MyList} 마이리스트 정보
   */
  async getMyList (n) {
    const temp = await this.db.select(this.m, { name: n })
    return temp[0] ? new MyList({ db: this.db, table: this.m }, temp[0]) : false
  }
}

class MyList {
  constructor (db, m) {
    if (!m) throw new Error()
    this.db = db.db
    this.table = db.table
    this.id = m.id
    this.name = m.name
    this.list = JSON.parse(m.list)
    this.author = m.author
  }

  add (id) {
    if (!id || (typeof id) !== 'string') return false
    this.list.push(id)
    return this.update()
  }

  update () {
    this.db.update(this.table, { list: JSON.stringify(this.list).split('"').join('\'') }, { id: this.id })
    return this
  }

  del (id) {
    if (!id) return
    const index = (typeof id) === 'number'
      ? (this.list.length <= id ? false : id)
      : ((typeof id) === 'string' ? this.list.indexOf(id) : false)
    if ((typeof index) === 'number' && index >= 0) this.list.splice(index, 1)
    else return false
    return this.update()
  }
}

module.exports = GetInfos
module.exports.MyList = MyList
