import { fetchData } from '../utils/fh5-data.js'
import { filters } from '../utils/filters.js'

export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(filters.makes(fetchData()))
}
