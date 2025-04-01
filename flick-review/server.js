const express = require("express");
const axios = require("axios");
require("dotenv").config();
const db = require("./config/db");
const session = require("express-session");
const bodyParser = require("body-parser");
const { loginUser, getUserProfile, signupUser } = require("./scripts/authController"); 
const app = express();
const PORT = 3022;
const path = require('path');

// ejs View Engine
app.set('views', path.join(__dirname,'views'));
app.set("view engine", "ejs");

// Serve Static Files (CSS, Images, JS)
app.use(express.static("public"));

// Middleware for Form Data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware for User Authentication
app.use(session({
    secret: "secret_key",  // Replace with a strong secret key
    resave: false,
    saveUninitialized: true
}));

// Middleware to Pass User Info to Views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Disable caching for all routes
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
});

const base_url = "https://api.themoviedb.org/3";

// Home Route - Fetch Movie Genres & Popular Movies
app.get("/", async (req, res) => {
    try {
        const [genresResponse, moviesResponse] = await Promise.all([
            axios.get(`${base_url}/genre/movie/list`, { 
                params: { api_key: process.env.API_KEY } }),
            axios.get(`${base_url}/movie/popular`, { 
                params: { api_key: process.env.API_KEY } })
        ]);

        const movie_genres = genresResponse.data.genres;
        const popular_movies = moviesResponse.data.results;

        res.render("home", { movie_genres, popular_movies });
    } catch (error) {
        console.error("ERROR fetching movie data:", error.message);
        res.status(500).send("Error fetching movie data");
    }
});

// Sign up route with session management
app.get("/signup", (req, res) => {
    res.render("login"); 
}).post("/signup", async (req, res) => {
    const { firstName, lastName, dob, username, email, password } = req.body;
    
    console.log("Signup request body:", req.body); 
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        await signupUser(firstName, lastName, dob, username, email, password);
        res.redirect("/login");
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/login', (req, res) => {
    res.render('login');  // This will render the login.ejs template
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Call loginUser to handle Firebase login and get user data from MySQL
        const user = await loginUser(email, password);

        // Store user session including role information
        req.session.user = {
            username: user.username,
            firebase_uid: user.firebase_uid,
            role: user.role,
            firstName: user.firstName // Add first name here
        };
        

        res.redirect("/");  // Redirect to home page after successful login
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in: " + error.message);
    }
});

// Profile Route with session
app.get("/profile", (req, res) => {
    const firebaseUid = req.session.user.firebase_uid;

    getUserProfile(firebaseUid, (err, user) => {
        if (err) {
            return res.status(500).send("Error fetching profile");
        }
        res.render("profile", { user });
    });
});

// Logout Route
app.get("/logout", (req, res) => {
    const firebase_uid = req.session.user.firebase_uid;

    const sql = `UPDATE users SET lastLogin = NOW() WHERE firebase_uid = ?`;

    db.query(sql, [firebase_uid], (err, result) => {
        if (err) {
            console.error("Error updating lastLogin:", err);
            return res.status(500).send("Internal Server Error");
        }

        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

// Movie Details Route
app.get("/movie/:id", async (req, res) => {
    const movieId = req.params.id;
    
    try {
        const movieResponse = await axios.get(`${base_url}/movie/${movieId}`, {
            params: { api_key: process.env.API_KEY }
        });
        const movieDetails = movieResponse.data;
        res.render("movieDetails", { movieDetails });
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
        res.status(500).send("Error fetching movie details");
    }
});

// Search Movies Route
app.get("/search", async (req, res) => {
    const query = req.query.query;
    
    if (!query) {
        return res.render("searchResults", { movies: [] });
    }

    try {
        const searchResponse = await axios.get(`${base_url}/search/movie`, {
            params: { api_key: process.env.API_KEY, query }
        });
        const searchResults = searchResponse.data.results;
        res.render("searchResults", { searchResults });
    } catch (error) {
        console.error("Error searching movies:", error.message);
        res.status(500).send("Error searching movies");
    }
});

// Add Movie Review (Requires Logged In User)
app.post("/review/:movieId", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    const { movieId } = req.params;
    const { reviewText } = req.body;
    const { firebase_uid } = req.session.user;

    const sql = `INSERT INTO reviews (movie_id, user_id, review_text) VALUES (?, ?, ?)`;
    
    db.query(sql, [movieId, firebase_uid, reviewText], (err, result) => {
        if (err) {
            console.error("Error inserting review:", err);
            return res.status(500).send("Error submitting review");
        }
        res.redirect(`/movie/${movieId}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
