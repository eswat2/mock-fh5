import { colors, randomArray } from '../utils/mocks.js'

export default (req, res) => {
  const { count } = req.query
  const num = count ? parseInt(count) : 1
  const max = colors.length - 1
  const indx = randomArray(num, max)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(indx.map((i) => colors[i]))
}
