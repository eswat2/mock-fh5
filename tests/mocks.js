import { chance, colors, dataSet, compare, delay, randomArray } from '../utils/mocks.js'
import { expect } from 'chai'
import vinGenerator from 'vin-generator'

const checkArray = (data, count) => {
  it('should return an array', () => {
    expect(data).to.be.a('array')
  })
  it(`should be ${count} items`, () => {
    expect(data.length).to.equal(count)
  })
}

const checkNumber = (data, min, max) => {
  it('should return a number', () => {
    expect(data).to.be.a('number')
  })
  it(`should be between ${min}-${max}`, () => {
    expect(data).to.be.gte(min)
    expect(data).to.be.lte(max)
  })
}

const checkString = (data, limit) => {
  const tag = limit ? 'return' : 'be'
  it(`should ${tag} a string`, () => {
    expect(data).to.be.a('string')
  })
  if (limit) {
    it(`should be ${limit} chars`, () => {
      expect(data.length).to.equal(limit)
    })
  }
}

describe('mocks', () => {
  describe('colors', () => {
    const count = 31
    const data = colors

    it('should return an array', () => {
      expect(data).to.be.a('array')
    })
    it(`should be ${count} items`, () => {
      expect(data.length).to.equal(count)
    })
    describe('items', () => {
      data.map((item) => {
        checkString(item)
      })
    })
  })

  describe('compare', () => {
    const data = [
      { id: 42, value: 'string' },
      { id: 42, value: 'string' },
      { value: 'string', id: 42 },
      { id: 43, value: 'number' },
    ]
    it('should be equal', () => {
      const check = compare(data[0], data[1])
      expect(check).to.be.true
    })
    it('should not be equal', () => {
      const check = compare(data[0], data[2])
      expect(check).to.be.false
    })
    it('should not be equal', () => {
      const check = compare(data[0], data[3])
      expect(check).to.be.false
    })
  })

  describe('delay', () => {
    const data = delay()
    const min = 500
    const max = 3500
    console.log('-- delay:', data)
    checkNumber(data, min, max)
  })

  describe('randomArray', () => {
    const count = 10
    const min = 0
    const max = 20
    const data = randomArray(count, max)
    console.log('-- randomArray:', data.toString())
    checkArray(data, count)
    describe('items', () => {
      data.map((item) => {
        checkNumber(item, min, max)
      })
    })
  })

  describe('vins', () => {
    const count = 3
    const data = chance.unique(vinGenerator.generateVin, count)
    console.log('-- vins:', data.toString())
    checkArray(data, count)
    describe('items', () => {
      data.map((item) => {
        checkString(item)
      })
    })
  })
})
