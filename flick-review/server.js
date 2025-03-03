const express = require("express");
const axios = require('axios')
require('dotenv').config()

const app = express();
const PORT = 3000;
const admin = require("firebase-admin");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db"); 


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
admin.initializeApp({
    credential: admin.credential.cert(require(path.resolve(serviceAccountPath))),
});

// ✅ Middleware to Verify Firebase Token
const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }
};

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
