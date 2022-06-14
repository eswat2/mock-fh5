import { expect } from 'chai'
import { fetchData } from '../utils/fh5-data.js'
import { filters } from '../utils/filters.js'

describe('filters.makes', () => {
  it('should return an array...', (done) => {
    const callback = (data) => {
      const list = filters.makes(data)
      console.log('-- data:', data.length)
      console.log('-- makes:', list.length)
      try {
        expect(list)
          .to.be.a('array')
          .that.have.lengthOf.above(2)
        done()
      } catch (error) {
        done(error)
      }
    }
    fetchData(callback)
  })
})
