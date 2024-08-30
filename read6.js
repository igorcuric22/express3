const fs = require('fs');
let input = fs.createReadStream('./read2.txt');

const chunks = [];
input.on('data', buf => chunks.push(buf));
input.on('end', () => console.log( Buffer.concat(chunks).toString() ))
