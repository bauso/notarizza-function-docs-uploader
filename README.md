# Notarize Doc Function

This is a Serverless Service to notarize documents with opentimestamp. 


## Init Firebase Project
 1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
 1. Install dependencies locally by running: `cd functions; npm install; cd -`


## Run locally
To run and test this code locally do:
 1. Start serving your project locally using `firebase serve --only functions`
 1. Open the app in a browser at `https://localhost:5000`.


## Deploy
Deploy
 1. Deploy your project using `firebase deploy --only functions:notarize-doc`


## Test
You can call the following curl calls from the root of the project.

**Stamp document**
Upload file bitcoin.pdf and save the output file in bitcoin.pdf.ots:
```bash
curl -XPOST -o bitcoin.pdf.ots http://localhost:5000/notarizza/us-central1/notarizeDoc/stamp -F 'doc=@./test files/bitcoin.pdf'
```

**Info**
Upload file bitcoin.ots.pdf to get the stamp info:
```bash
curl -XPOST http://localhost:5000/notarizza/us-central1/notarizeDoc/info -F 'ots=@./test files/bitcoin.pdf.ots'
```

**Verify**
Upload both the bitcoin.pdf and the stamped file bitcoin.pdf.ots to verify the timestamp when the file was stamped:
```bash
curl -XPOST http://localhost:5000/notarizza/us-central1/notarizeDoc/verify -F 'ots=@../test files/bitcoin.pdf.ots' -F 'doc=@./test files/bitcoin.pdf'
```

**Upgrade**
Upload both the bitcoin.pdf and the stamped file bitcoin.pdf.ots to verify the timestamp when the file was stamped:
```bash
curl -XPOST -o bitcoin.pdf.ots http://localhost:5000/notarizza/us-central1/notarizeDoc/upgrade -F 'ots=@./test files/bitcoin.pdf.ots'
```


