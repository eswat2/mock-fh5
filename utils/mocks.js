import Chance from 'chance'
import vinGenerator from 'vin-generator'
import shortid from 'shortid'
import { filters } from './filters.js'

const chance = new Chance()

const colors = [
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'mint green',
  'teal',
  'white',
  'black',
  'orange',
  'pink',
  'grey',
  'maroon',
  'violet',
  'turquoise',
  'tan',
  'sky blue',
  'salmon',
  'plum',
  'orchid',
  'olive',
  'magenta',
  'lime',
  'ivory',
  'indigo',
  'gold',
  'fuchsia',
  'cyan',
  'azure',
  'lavender',
  'silver',
]

const dealerSuffix = [
  'Autos',
  'Cars',
  'Deals',
  'Group',
  'LLC',
  'Lot',
  'Motors',
  'Rides',
  'Sales',
  'Transit',
  'Venture',
]

const fieldSorter = (fields) => (a, b) =>
  fields
    .map((o) => {
      let dir = 1
      if (o[0] === '-') {
        dir = -1
        o = o.substring(1)
      }
      return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0
    })
    .reduce((p, n) => (p ? p : n), 0)

const generateDealers = (data) => {
  const numDealers = chance.integer({ min: 3, max: 7 })
  const dealerIds = chance.unique(chance.ssn, numDealers, {
    dashes: false,
  })

  const dealers = dealerIds.reduce((bucket, id) => {
    const numVins = chance.integer({ min: 3, max: 14 })
    const ids = chance.unique(vinGenerator.generateVin, numVins)
    const cars = ids
      .map((vin) => {
        const indx = chance.integer({ min: 0, max: data.length - 1 })
        const color = chance.pickone(colors)
        const { make, model, year } = data[indx]
        const obj = {
          id: shortid.generate(),
          vin,
          make,
          model,
          year,
          color,
        }
        return obj
      })
      .sort(fieldSorter(['-year', 'make', 'model']))

    const dealer = {
      id: shortid.generate(),
      dealerId: id,
      name: `${chance.name()} ${chance.pickone(dealerSuffix)}`,
      vehicles: cars,
    }
    return [...bucket, dealer]
  }, [])

  return dealers
}

const generateSummaryFor = (dealers) => {
  const cars = dealers.reduce((bucket, dealer) => {
    dealer.vehicles.forEach((car) => {
      bucket.push(car)
    })
    return bucket
  }, [])

  const makes = filters.makes(cars).sort()
  const vins = cars.map((car) => car.vin)

  const summary = {
    makes,
    vins,
    counts: {
      dealers: dealers.length,
      makes: makes.length,
      vehicles: vins.length,
    },
  }

  return summary
}

const dataSet = (data, id) => {
  const dealers = generateDealers(data)
  const summary = generateSummaryFor(dealers)

  return {
    id,
    data: {
      dealers,
    },
    summary,
  }
}

// NOTE:  verify the data... (property order matters)
const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const delay = () => {
  return chance.integer({ min: 500, max: 3500 })
}

const randomArray = (length, max) =>
  Array(length)
    .fill()
    .map(() => Math.round(Math.random() * max))

export { chance, colors, dataSet, compare, delay, randomArray }
