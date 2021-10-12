import Papa from "papaparse";
import fs from "fs";

var sampleRawCsv = './src/utils/fh5-data.csv';

Papa.parse(fs.createReadStream(sampleRawCsv), {
	header: true,
	dynamicTyping: true,
	complete: function(results) {
		console.log(results);
	}
});
