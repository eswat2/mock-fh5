import { expect } from 'chai'
import { fetchData, parseCsv } from '../utils/fh5-data.js'

describe('fh5-data', () => {
  describe('parseCsv', () => {
    // NOTE:  these pin the behavior of the library parser we replaced...
    const csv = ['a,b,c,d', '2001,one,two', '2017,three,4,five', ''].join('\n')
    const rows = parseCsv(csv)

    it('should skip the header & any blank lines', () => {
      expect(rows).to.be.a('array').that.have.lengthOf(2)
    })

    it('should omit the trailing keys on short rows', () => {
      expect(rows[0]).to.deep.equal({ a: 2001, b: 'one', c: 'two' })
    })

    it('should coerce numeric fields & leave the rest as strings', () => {
      expect(rows[1]).to.deep.equal({ a: 2017, b: 'three', c: 4, d: 'five' })
    })
  })

  describe('fetchData', () => {
    const data = fetchData()

    it('should return every car in the raw csv', () => {
      expect(data).to.be.a('array').that.have.lengthOf(866)
    })

    it('should cache the parsed data', () => {
      expect(fetchData()).to.equal(data)
    })

    it('should provide year, make & model on every row', () => {
      data.map((car) => {
        expect(car).to.contains.all.keys('year', 'make', 'model')
      })
    })
  })
})
