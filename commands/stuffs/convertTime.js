module.exports = (s) => {
  let d = Math.floor(s / 86400)
  s %= 86400
  let h = Math.floor(s / 3600)
  s %= 3600
  let m = Math.floor(s / 60)
  s %= 60

  return [d, h, m, s]
}