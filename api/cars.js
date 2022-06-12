import { fetchData } from '../utils/fh5-data.js'

export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const callback = (data) => {
    res.json(data)
  }
  fetchData(callback)
}
