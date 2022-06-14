import Papa from 'papaparse'
import path from 'path'
import fs from 'fs'

var sampleRawCsv = path.resolve('./utils/fh5-raw.csv')

const fetchData = (callback) => {
  console.log('-- fetchData', sampleRawCsv)
  Papa.parse(fs.createReadStream(sampleRawCsv), {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      // console.log(results)
      callback(results.data)
    },
  })
}

export { fetchData }
