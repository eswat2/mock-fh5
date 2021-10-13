import Papa from "papaparse";
import path from 'path'
import fs from "fs";

var sampleRawCsv = path.resolve('./utils/fh5-raw.csv');

const fetchData = (callback) => {
	Papa.parse(fs.createReadStream(sampleRawCsv), {
		header: true,
		dynamicTyping: true,
		complete: function(results) {
			callback(results);
		}
	});
};

const callback = results => {
	console.log(results)
}

fetchData(callback)
