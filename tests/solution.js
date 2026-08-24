import { expect } from 'chai'
import { fetchData } from '../utils/fh5-data.js'
import { filters } from '../utils/filters.js'
import { dataSet } from '../utils/mocks.js'

const keys = ['id', 'data', 'summary']
const tags = ['makes', 'vins', 'counts']
const sums = ['dealers', 'makes', 'vehicles']
const dealerTags = ['id', 'dealerId', 'vehicles']
const carTags = ['id', 'vin', 'make', 'model', 'year', 'color']

const checkSolution = (solution, id) => {
  expect(solution)
    .to.be.a('object')
    .that.contains.all.keys(...keys)
  const { data, summary } = solution
  expect(solution.id).to.equal(id)
  console.log('-- solution.id:', solution.id)
  expect(data).to.be.a('object').that.contains.all.keys('dealers')
  const { dealers } = data
  dealers.map((dealer) => {
    expect(dealer)
      .to.be.a('object')
      .that.contains.all.keys(...dealerTags)
    const { vehicles } = dealer
    vehicles.map((car) => {
      expect(car)
        .to.be.a('object')
        .that.contains.all.keys(...carTags)
    })
  })
  expect(summary)
    .to.be.a('object')
    .that.contains.all.keys(...tags)
  const { counts } = summary
  expect(counts)
    .to.be.a('object')
    .that.contains.all.keys(...sums)
  console.log('-- counts:', counts)
}

const fetchMakes = () => {
  const data = fetchData()
  const list = filters.makes(data)
  console.log('-- data:', data.length)
  console.log('-- makes:', list.length)
  expect(list).to.be.a('array').that.have.lengthOf.above(2)
}

const fetchSolution = (id) => {
  const data = fetchData()
  const solution = id ? dataSet(data, id) : dataSet(data)
  checkSolution(solution, id ? id : 42)
}

describe('data - forza horizon 5', () => {
  describe('filters', () => {
    describe('makes', () => {
      it('should return an array...', () => {
        fetchMakes()
      })
    })
  })

  describe('solution', () => {
    const id = 342
    it(`should return an object... ${keys}`, () => {
      fetchSolution()
    })

    it(`should return an object... ${keys} & ${id}`, () => {
      fetchSolution(id)
    })
  })
})
