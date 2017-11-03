const OpenTimestamps = require('javascript-opentimestamps');
var fs = require('fs');

fs.readFile('hello-world.txt.ots', (err, ots) => {
    console.log(ots);
    return;
});


// const fileOts = Buffer.from(ots.toString('hex'))
// const detached = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
// console.log(detached);
// return;
//
// const infoResult = OpenTimestamps.info(ots);
// console.log(infoResult)


//
//
// fs.readFile('bitcoin.pdf.ots', 'utf8', (err, contents) => {
//
//     const infoResult = OpenTimestamps.info(contents);
//     console.log(infoResult);
//     return;
//
//     const fileOts = new Buffer(contents.toString('hex'))
//     //const fileOts = Buffer.from(contents.toString('utf8'));
//     const detached = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
//     const infoResult = OpenTimestamps.info(detached);
//     console.log(infoResult)
// });