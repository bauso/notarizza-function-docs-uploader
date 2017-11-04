//const functions = require('firebase-functions');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const OpenTimestamps = require('javascript-opentimestamps');
const app = require('express')();
var fs = require('fs');

app.listen(5000, () => console.log('Suca Firebase on localhost:5000'))
// Healthcheck
app.get('/', (req, res) => {
    res.send({
        "status": "OK"
    });
});

// Stamp document
app.post('/stamp', multipartMiddleware, (req, res) => {
    console.log(req.files);

    if (!req.files || !req.files.doc) {
        return res.send("You must upload a document (doc)!");
    }

    const file = Buffer.from(req.files.doc.toString('utf8'));
    const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
    OpenTimestamps.stamp(detached).then(() => {
        // get the info
        const infoResult = OpenTimestamps.info(detached);
        console.log(infoResult);

        // save the ots file
        const ctx = new OpenTimestamps.Context.StreamSerialization();
        detached.serialize(ctx);
        const buffer = new Buffer(ctx.getOutput());
        const otsFilename = req.files.doc.originalFilename + '.ots';
        // saveOts(otsFilename, buffer); // instead of saving the file in local, return it to the API caller

        // return the info
        res.set({'Content-Type': 'application/octet-stream'});
        res.write(buffer,'binary');
        res.end(null, 'binary');
    });
});


// Info
app.post('/info', multipartMiddleware, (req, res) => {
    if (!req.files || !req.files.ots) {
        return res.send("You must upload a timestamp file (ots)!");
    }
    const fileOtsPath = req.files.ots.path;
    fs.readFile(fileOtsPath, (err, fileOts) => {
        const detached = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
        const infoResult = OpenTimestamps.info(detached);
        return res.send(infoResult);
    });
});


// Verify document
app.post('/verify', multipartMiddleware, (req, res) => {
    if (!req.files) {
        return res.status(400).json({message: "Verification failed!","error":"You must upload a document (doc) and a timestamp file (ots)!"});
    }
    if (!req.files.doc) {
        return res.status(400).json({message: "Verification failed!","error":"You must upload a document (doc)!"});
    }
    if (!req.files.ots) {
        return res.status(400).json({message: "Verification failed!","error":"You must upload a timestamp file (ots)!"});
    }

    const filePath = req.files.doc.path;
    const fileOtsPath = req.files.ots.path;
    fs.readFile(filePath, (err, file) => {
        fs.readFile(fileOtsPath, (err, fileOts) => {
            const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
            const detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
            OpenTimestamps.verify(detachedOts,detached).then(verifyResult => {
                // return a timestamp (ISO 8601) if verified, undefined otherwise.
                res.status(200).json({message: "ots verified!", timestamp:new Date(verifyResult*1000)});
            }).catch(err => {
                res.status(404).json({message: "Verification failed!","error":err});
            });
        });
    });
});

//exports.notarizeDoc = functions.https.onRequest(app);

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



