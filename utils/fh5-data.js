import fs from 'node:fs'
import path from 'node:path'

const sampleRawCsv = path.resolve('./utils/fh5-raw.csv')

// NOTE:  the raw data is plain CSV -- no quoted fields, no embedded commas...
const typed = (value) => {
  if (value === '') return null
  if (value === 'true') return true
  if (value === 'false') return false
  const num = Number(value)
  return value.trim() !== '' && !isNaN(num) ? num : value
}

// NOTE:  rows are ragged, short rows simply omit the trailing keys...
const parseCsv = (text) => {
  const [header, ...rows] = text.split('\n').filter((line) => line !== '')
  const keys = header.split(',')
  return rows.map((row) =>
    row.split(',').reduce((car, value, indx) => ({ ...car, [keys[indx]]: typed(value) }), {})
  )
}

let cache = null

// NOTE:  the data is static, parse it once & re-use it across invocations...
const fetchData = () => {
  if (cache === null) {
    console.log('-- fetchData', sampleRawCsv)
    cache = parseCsv(fs.readFileSync(sampleRawCsv, 'utf8'))
  }
  return cache
}

export { fetchData, parseCsv }
