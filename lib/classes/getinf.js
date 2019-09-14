class GetInfos {
  constructor (db, userTable, serverTable, myListTable) {
    if (!db) throw new Error()
    this.db = db
    this.u = userTable
    this.s = serverTable
    this.m = myListTable
  }

  async getIns (table, a, b, assignBoth) {
    const dat = await this.db.select(table, a)
    if (!dat) throw new Error()
    else if (!dat[0]) {
      this.db.insert(table, b ? (assignBoth ? a.assign(b) : b) : a)
      return this.getIns(table, a)
    }

    return dat[0]
  }

  async getUser (u) {
    return await this.getIns(this.u, { id: u.id })
  }

  async getGuild (s) {
    return await this.getIns(this.s, { id: s.id }, { owner: s.ownerID }, true)
  }

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
    const index = (typeof id) === 'number' ?
      (this.list.length <= id ? false : id) :
      ((typeof id) === 'string' ? this.list.indexOf(id) : false)
    if ((typeof index) === 'number' && index >= 0) this.list.splice(index, 1)
    else return false
    return this.update()
  }
}

module.exports = GetInfos
