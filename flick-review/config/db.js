// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",           // Matches settings.json
//     password: "microlab087",   // Matches settings.json
//     database: "flick_review", // Ensure it matches the correct database name
//     port: 3306              // Matches settings.json
// });

// // ✅ Connect to MySQL
// db.connect(err => {
//     if (err) {
//         console.error("❌ MySQL Connection Error:", err);
//         return;
//     }
//     console.log("✅ Connected to MySQL Database: Flickreview");
// });

// module.exports = db;


require("dotenv").config(); // Load environment variables
const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "microlab087",
//     database: process.env.DB_NAME || "flick_review",
//     port: process.env.DB_PORT || 3306
// });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// ✅ Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
        return;
    }
    console.log(`✅ Connected to MySQL Database: ${process.env.DB_NAME}`);
});

module.exports = db;
