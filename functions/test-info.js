const OpenTimestamps = require('javascript-opentimestamps');
var fs = require('fs');

fs.readFile('hello-world.txt.ots', (err, fileOts) => {
    const detached = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
    const infoResult = OpenTimestamps.info(detached);
    console.log(infoResult);
});