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
const axios = require("axios");
const db = require("./config/db"); // ✅ Import MySQL connection
require("dotenv").config();
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// ✅ Set EJS as the View Engine
app.set("view engine", "ejs");

// ✅ Serve Static Files (CSS, Images, JS)
app.use(express.static("public"));

// ✅ Middleware for Form Data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session Middleware for User Authentication
app.use(session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true
}));

// ✅ Middleware to Pass User Info to Views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

const base_url = "https://api.themoviedb.org/3";

// ✅ Home Route - Fetch Movie Genres & Popular Movies
app.get("/", async (req, res) => {
    try {
        const [genresResponse, moviesResponse] = await Promise.all([
            axios.get(`${base_url}/genre/movie/list`, { params: { api_key: process.env.API_KEY } }),
            axios.get(`${base_url}/movie/popular`, { params: { api_key: process.env.API_KEY } })
        ]);

        const movie_genres = genresResponse.data.genres;
        const popular_movies = moviesResponse.data.results;

        res.render("home", { movie_genres, popular_movies });
    } catch (error) {
        console.error("ERROR fetching movie data:", error.message);
        res.status(500).send("Error fetching movie data");
    }
});

// ✅ Fetch Movies by Genre
app.get("/genre/:id", async (req, res) => {
    const genreId = req.params.id;

    try {
        const response = await axios.get(`${base_url}/discover/movie`, {
            params: { api_key: process.env.API_KEY, with_genres: genreId },
        });

        const movies = response.data.results;
        res.render("genre", { movies });
    } catch (error) {
        console.error("ERROR fetching movies by genre:", error.message);
        res.status(500).send("Error fetching movies for this genre");
    }
});

// ✅ User Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Login Error:", err);
            return res.status(500).send("Server error");
        }

        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        const user = results[0];

        // 🚀 For now, assuming plain text passwords (HASH PASSWORDS IN REAL USE)
        if (password !== user.password) {
            return res.status(401).send("Incorrect password");
        }

        // ✅ Store user session
        req.session.user = { username: user.username, email: user.email };
        res.redirect("/");
    });
});

// ✅ User Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// ✅ Movie Details Page with Reviews
app.get("/movie/:id", async (req, res) => {
    const movieId = req.params.id;

    try {
        const response = await axios.get(`${base_url}/movie/${movieId}`, {
            params: { api_key: process.env.API_KEY }
        });

        const movie = response.data;

        // ✅ Fetch Reviews from MySQL
        db.query("SELECT * FROM reviews WHERE movieID = ?", [movieId], (err, reviews) => {
            if (err) {
                console.error("Error fetching reviews:", err);
                return res.status(500).send("Error fetching reviews");
            }

            res.render("movie", { movie, reviews });
        });

    } catch (error) {
        console.error("ERROR fetching movie details:", error.message);
        res.status(500).send("Error fetching movie details");
    }
});

// ✅ Submit a Review
app.post("/review", (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("You must be logged in to write a review");
    }

    const { movieID, text, rating } = req.body;
    const username = req.session.user.username;

    db.query("INSERT INTO reviews (username, movieID, text, rating) VALUES (?, ?, ?, ?)", 
        [username, movieID, text, rating], 
        (err, result) => {
            if (err) {
                console.error("Error submitting review:", err);
                return res.status(500).send("Error submitting review");
            }
            res.redirect(`/movie/${movieID}`);
        }
    );
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
