const express = require("express");

const app = express();

app.use(express.static(__dirname));


app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/login/index.html");
});

app.get("/login", (req, res) =>{
    res.sendFile(__dirname + "/login/index.html");
});

app.get("/register", (req, res) =>{
    res.sendFile(__dirname + "/register/index.html");
});

app.listen(3000, () =>{
    console.log("Server Running On Port 3000");
});

