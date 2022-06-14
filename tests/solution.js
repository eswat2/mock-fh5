import { expect } from 'chai'
import { fetchData } from '../utils/fh5-data.js'
import { dataSet } from '../utils/mocks.js'

describe('solution', function () {
  this.timeout(10000)
  const id = 342
  const keys = ['id', 'data', 'summary']
  const tags = ['makes', 'vins', 'counts']

  it(`should be an object... ${keys} & ${id}`, function (done) {
    const callback = (data) => {
      const solution = dataSet(data, id)
      try {
        expect(solution)
          .to.be.a('object')
          .that.contains.all.keys(...keys)
        expect(solution.id).to.equal(id)
        expect(solution.data).to.be.a('object').that.contains.all.keys('dealers')
        expect(solution.summary)
          .to.be.a('object')
          .that.contains.all.keys(...tags)
        done()
      } catch (error) {
        done(error)
      }
    }
    fetchData(callback)
  })
})
