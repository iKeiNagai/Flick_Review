// const express = require("express");
// const admin = require("./firebase"); // Import Firebase Admin SDK
// const app = express();
// const PORT = 3000;

// // Example: Fetch data from Firestore
// app.get("/", async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const snapshot = await db.collection("your-collection").get();
//     const data = snapshot.docs.map((doc) => doc.data());
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

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
  console.log(`Server is running on http://localhost:${PORT}`);
});
