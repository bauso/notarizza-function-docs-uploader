const functions = require('firebase-functions');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const OpenTimestamps = require('javascript-opentimestamps');
const app = require('express')();


app.post('/', multipartMiddleware, (req, res) => {
    console.log(req.files);

    if (!req.files || !req.files.doc) {
        return res.send("You must upload a file!");
    }

    const file = Buffer.from(req.files.doc.toString('utf8'));
    const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
    OpenTimestamps.stamp(detached).then(() => {

        // get the info
        const infoResult = OpenTimestamps.info(detached);
        console.log(infoResult);

        // save the ots file
        const Context = require('./node_modules/javascript-opentimestamps/src/context.js');
        const ctx = new Context.StreamSerialization();
        detached.serialize(ctx);
        const buffer = new Buffer(ctx.getOutput());
        const otsFilename = req.files.doc.originalFilename + '.ots';
        // saveOts(otsFilename, buffer); // don't save the file

        // return the info
        res.set({'Content-Type': 'application/octet-stream'});
        res.write(buffer,'binary');
        res.end(null, 'binary');
    });
});

app.post('/verify', multipartMiddleware, (req, res) => {

    console.log(req.files);
    if (!req.files || !req.files.doc) {
        return res.send("You must upload a file!");
    }
    const file = Buffer.from(req.files.doc.toString('utf8'));
    const fileOts = Buffer.from(req.files.ots.toString('utf8'));

    const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
    const detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
    OpenTimestamps.verify(detachedOts, detached).then(verifyResult => {
        // return a timestamp if verified, undefined otherwise.
        console.log(verifyResult);
    });


});

exports.notarizeDoc = functions.https.onRequest(app);


function saveOts(otsFilename, buffer) {
    const fs = require('fs');
    fs.exists(otsFilename, fileExist => {
        if (fileExist) {
            console.log('The timestamp proof \'' + otsFilename + '\' already exists');
        } else {
            fs.writeFile(otsFilename, buffer, 'binary', err => {
                if (err) {
                    return console.log(err);
                }
                console.log('The timestamp proof \'' + otsFilename + '\' has been created!');
            });
        }
    });
}



