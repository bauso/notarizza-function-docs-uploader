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

**Stamp document**
Upload file bitcoin.pdf and save the output file in bitcoin.ots:
```bash
curl -o bitcoin.ots http://localhost:5000/notarizza/us-central1/notarizeDoc -F 'doc=@./bitcoin.pdf'
```

**Info**
Upload file bitcoin.ots to verify that is being uploaded:

