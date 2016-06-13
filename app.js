let fs = require('fs');

let filePath = __dirname;

console.log(__dirname.replace(/\\/g, '\\\\'))

fs.readdir(filePath, (err, files) => {
	if (err) throw err;

	console.log(__dirname, files)
} );


