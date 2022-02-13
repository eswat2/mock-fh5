import Chance from 'chance'
import vinGenerator from 'vin-generator'

const chance = new Chance()

module.exports = (req, res) => {
  const { count } = req.query
  const num = count ? parseInt(count) : 3
  const vins = chance.unique(vinGenerator.generateVin, num)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(vins)
}
