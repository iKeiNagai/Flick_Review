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
const path = require("path");

const app = express();
const PORT = 3000;

// Serve the HTML file from the same folder as server.js
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
