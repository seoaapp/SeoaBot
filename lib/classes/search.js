const ytsr = require('ytsr')

/**
 * YoutubeSearcher
 * @class YoutubeSearcher
 */
class YoutubeSearcher {
  addParam () {
    return this
  }

  setPart () {
    return this
  }

  /**
   * @param {String} q 유튜브에 검색할 검색어
   * @param {Number} c 검색할 갯수
   * @param {?Function} cb 콜백
   * @returns {Promise | undefined} 검색 결과 Promise 또는 없음 (콜백이 없는 경우 Promise로 반환)
   */
  _ (q, c, cb) {
    if (cb) return this.search(q, c, cb)
    else return this.promiseSearch(q, c)
  }

  makeModel (temp) {
    const res = []
    temp.items.forEach(item => {
      /*
        this.url = inf.info.uri
        this.title = inf.info.title
        this.author = inf.info.author
        this.length = inf.info.length / 1000
        this.vID = inf.info.identifier
        this.track = inf.track
        ytdl.getBasicInfo(this.url).then(inf => {
          this.thumbnail = inf.player_response.videoDetails.thumbnail.thumbnails[3].url
        })
      */
      const durations = item.duration.split(':').map(v => Number(v))
      const duration = (durations[0] * 60 + durations[1]) * 1000
      const videoID = item.link.replace('https://www.youtube.com/watch?v=', '')
      res.push({
        id: { videoId: videoID },
        info: {
          uri: item.link,
          title: item.title,
          duration: duration,
          vID: videoID,
          player_response: {
            videoDetails: {
              thumbnail: {
                thumbnails: [null, null, null, {
                  url: item.thumbnail
                }]
              }
            }
          }
        }
      })
    })
    console.log(temp)
    console.log(res)
    return { items: res }
  }

  errHandler (err, pRej) {
    if (err) {
      if (!pRej) throw err
      pRej(err)
    }
  }

  /**
   * @param {String} q 유튜브에 검색할 검색어
   * @param {Number} c 검색할 갯수
   * @param {?Function} cb 콜백
   * @param {?Function} pRes Promise Resolve Function
   * @param {?Function} pRej Promise Reject Function
   * @returns {undefined} 콜백 또는 Promise Function를 통하여 검색 결과가 리턴됩니다.
   */
  search (q, c, cb, pRes, pRej) {
    ytsr.getFilters(q, (err, filters) => {
      this.errHandler(err, pRej)
      const filter = filters.get('Type').find(o => o.name === 'Video')
      ytsr.getFilters(filter.ref, (err, filters) => {
        this.errHandler(err, pRej)
        ytsr(null, { limit: c, nextpageRef: filter.ref }, (err, res) => {
          this.errHandler(err, pRej)
          cb ? cb(this.makeModel(res))
            : pRes
              ? pRes(this.makeModel(res))
              : this.errHandler(new Error())
        })
      })
    })
  }

  /**
   * @param {String} q 유튜브에 검색할 검색어
   * @param {Number} c 검색할 갯수
   * @returns {Promise} 검색 결과
   */
  promiseSearch (q, c) {
    return new Promise((resolve, reject) => {
      this.search(q, c, null, resolve, reject)
    })
  }
}

module.exports = YoutubeSearcher
