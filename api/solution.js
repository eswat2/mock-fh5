const { fetchData } = require('../utils/fh5-data')
const { dataSet } = require('../utils/mocks')

module.exports = (req, res) => {
  const { id } = req.query
  // NOTE:  we are returning the id & solution in the response...
  res.setHeader('Access-Control-Allow-Origin', '*')

  const callback = (data) => {
    const solution = dataSet(data, id)
    res.json(solution)
  }
  fetchData(callback)
}
