const functions = require('firebase-functions');
const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();


const OpenTimestamps = require('javascript-opentimestamps');

app.post('/', multipartMiddleware, (req, res) => {
    console.log(req.files);
    if (!req.files || !req.files.doc) {
        return res.send("You must upload a file!");
    }
    const file = Buffer.from(req.files.doc.toString('utf8'));
    const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
    OpenTimestamps.stamp(detached).then(() => {
        const infoResult = OpenTimestamps.info(detached);
        console.log(infoResult);
        res.send(infoResult);
    });
});

exports.notarizeDoc = functions.https.onRequest(app);