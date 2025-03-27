const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",           // Matches settings.json
    password: "Password",   // Matches settings.json
    database: "Flickreview", // Ensure it matches the correct database name
    port: 3306              // Matches settings.json
});

//  Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
        return;
    }
    console.log(" Connected to MySQL Database: Flickreview");
});

module.exports = db;