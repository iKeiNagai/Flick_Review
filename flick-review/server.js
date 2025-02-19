const express = require("express");

const app = express();

const PORT = 3000;

//simple get request
app.get('/', (req, res) =>{
    res.send("Get request")
})

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})