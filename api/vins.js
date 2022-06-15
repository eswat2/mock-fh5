import { api } from '../utils/mocks.js'

export default (req, res) => {
  const { count } = req.query

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(api.vins(count))
}
