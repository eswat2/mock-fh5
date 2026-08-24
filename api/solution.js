import { fetchData } from '../utils/fh5-data.js'
import { dataSet } from '../utils/mocks.js'

export default (req, res) => {
  const { id } = req.query
  // NOTE:  we are returning the id & solution in the response...
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(dataSet(fetchData(), id))
}
