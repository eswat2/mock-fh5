import { fetchData } from '../utils/fh5-data.js'
import { filters } from '../utils/filters.js'

export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const callback = (data) => {
    const list = filters.makes(data)
    res.json(list)
  }
  fetchData(callback)
}
