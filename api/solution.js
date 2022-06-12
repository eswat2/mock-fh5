import { fetchData } from '../utils/fh5-data.js'
import { dataSet } from '../utils/mocks.js'

export default (req, res) => {
  const { id } = req.query
  // NOTE:  we are returning the id & solution in the response...
  res.setHeader('Access-Control-Allow-Origin', '*')

  const callback = (data) => {
    const solution = dataSet(data, id)
    res.json(solution)
  }
  fetchData(callback)
}
