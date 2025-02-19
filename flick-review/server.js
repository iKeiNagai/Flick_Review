const express = require("express");
const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();


const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

//initialize firebase admin sdk with credentials
admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve(serviceAccountPath))),
});
const app = express();

const PORT = 3000;

//simple get request
app.get('/', (req, res) =>{
    res.send("Get request")
})

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})
