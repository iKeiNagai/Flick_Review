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
const axios = require('axios')
require('dotenv').config()

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs')
//
app.get("/", (req, res) => {
  res.render("index");
});


const base_url= "https://api.themoviedb.org/3"
app.get("/home", async(req,res) => {
  try{
    const response = await axios.get(`${base_url}/genre/movie/list`, {
      params: { api_key: process.env.API_KEY}
    });

    const movie_genre = response.data.genres;
    res.render("home", {movie_genre})
  }catch(error){
    console.error("ERROR fetching", error.message)
  }
})

app.get("/home/:genre", (req,res) =>{
  const mgenre = req.params.genre;
  res.render("genre", {mgenre});
})
// ✅ Root Route
app.get("/", (req, res) => {
    res.send("FlickReview API is Running with Firebase & MySQL!");
});

// ✅ Protected Route (Requires Firebase Authentication)
app.get("/protected", verifyFirebaseToken, (req, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});

// ✅ Store Firebase User in MySQL After Signup
app.post("/register", verifyFirebaseToken, (req, res) => {
    const { email, uid } = req.user;

    const query = "INSERT INTO users (username, email) VALUES (?, ?)";
    db.query(query, [uid, email], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "User registered successfully!", userId: result.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})
