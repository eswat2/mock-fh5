import { expect } from 'chai'
import { fetchData } from '../utils/fh5-data.js'
import { dataSet } from '../utils/mocks.js'

const keys = ['id', 'data', 'summary']
const tags = ['makes', 'vins', 'counts']
const sums = ['dealers', 'makes', 'vehicles']

const checkSolution = (solution, id) => {
  expect(solution)
    .to.be.a('object')
    .that.contains.all.keys(...keys)
  expect(solution.id).to.equal(id)
  console.log('-- solution.id:', solution.id)
  expect(solution.data).to.be.a('object').that.contains.all.keys('dealers')
  expect(solution.summary)
    .to.be.a('object')
    .that.contains.all.keys(...tags)
  expect(solution.summary.counts)
    .to.be.a('object')
    .that.contains.all.keys(...sums)
  console.log('-- counts:', solution.summary.counts)
}

const fetchSolution = (done, id) => {
  const callback = (data) => {
    const solution = id ? dataSet(data, id) : dataSet(data)
    try {
      checkSolution(solution, id ? id : 42)
      done()
    } catch (error) {
      done(error)
    }
  }
  fetchData(callback)
}

describe('solution', () => {
  const id = 342
  it(`should return an object... ${keys}`, (done) => {
    fetchSolution(done)
  })

  it(`should return an object... ${keys} & ${id}`, (done) => {
    fetchSolution(done, id)
  })
})
