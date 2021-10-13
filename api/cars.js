const { fetchData } = require('../utils/fh5-data')

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const callback = (data) => {
    res.json(data)
  }
  fetchData(callback)
}
