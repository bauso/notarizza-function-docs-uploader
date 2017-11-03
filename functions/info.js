const OpenTimestamps = require('javascript-opentimestamps');
var fs = require('fs');

fs.readFile('bitcoin.pdf.ots', 'utf8', (err, contents) => {
    const fileOts = Buffer.from(contents.toString('utf8'));
    const detached = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
    const infoResult = OpenTimestamps.info(detached);
    console.log(infoResult)
});

fs.readFile('hello-world.txt.ots', 'utf8', (err, ots) => {
    const infoResult = OpenTimestamps.info(ots);
    console.log(infoResult)
});
