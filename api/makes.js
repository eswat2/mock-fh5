const { fetchData } = require('../utils/fh5-data')
const { filters } = require('../utils/filters')

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const callback = (data) => {
    const list = filters.makes(data)
    res.json(list)
  }
  fetchData(callback)
}
